const CommunityPost = require('../models/CommunityPost');
const CommunityAnswer = require('../models/CommunityAnswer');
const CommunityComment = require('../models/CommunityComment');
const CommunityReaction = require('../models/CommunityReaction');
const CommunityPollVote = require('../models/CommunityPollVote');
const CommunitySavedPost = require('../models/CommunitySavedPost');
const CommunityNotification = require('../models/CommunityNotification');
const CommunityReport = require('../models/CommunityReport');
const Student = require('../models/Student');
const User = require('../models/User');

// Helper to mask anonymous author
const maskAuthor = (authorDoc, isAnonymous) => {
  if (isAnonymous) {
    return {
      _id: 'anonymous',
      name: 'Anonymous Student 🎓',
      photo: '/logo.png',
      school: 'PiyushDhara Learning Platform',
      isAnonymous: true
    };
  }
  return authorDoc;
};

// Helper to calculate XP and Badges
const calculateUserBadges = (stats) => {
  const { totalPosts, totalAnswers, bestAnswersCount, totalReactionsReceived, reputationScore } = stats;
  const badges = [];

  if (totalPosts >= 1) badges.push({ id: 'first_question', title: 'First Question ❓', icon: '🎯', desc: 'Asked first doubt or discussion' });
  if (totalAnswers >= 1) badges.push({ id: 'first_answer', title: 'First Answer 💡', icon: '⚡', desc: 'Answered a peer doubt' });
  if (totalPosts >= 5) badges.push({ id: 'active_curious', title: 'Curious Learner 🔍', icon: '📚', desc: 'Created 5+ community posts' });
  if (totalAnswers >= 5) badges.push({ id: 'community_helper', title: 'Community Helper 🤝', icon: '🌟', desc: 'Provided 5+ helpful answers' });
  if (bestAnswersCount >= 1) badges.push({ id: 'best_answer_award', title: 'Best Answer Winner ✅', icon: '🏆', desc: 'Answer marked as Best Answer' });
  if (bestAnswersCount >= 3) badges.push({ id: 'expert_mentor', title: 'Expert Mentor 👨‍🏫', icon: '🎖️', desc: 'Earned 3+ Best Answer badges' });
  if (totalReactionsReceived >= 20) badges.push({ id: 'popular_contributor', title: 'Popular Contributor 🔥', icon: '❤️', desc: 'Received 20+ community reactions' });
  if (reputationScore >= 100) badges.push({ id: 'hundred_rep', title: '100 Reputation XP 💎', icon: '⭐', desc: 'Reached 100+ reputation points' });

  return badges;
};

/**
 * @desc    Create a new Community Post (Doubt, Discussion, or Poll)
 * @route   POST /api/community/posts
 * @access  Private (Protect)
 */
const createPost = async (req, res) => {
  try {
    const studentId = req.user._id;
    const {
      postType,
      title,
      content,
      isAnonymous,
      category,
      subject,
      difficulty,
      tags,
      pollOptions,
      pollDurationDays,
      pollAllowMultiple,
      pollIsAnonymous
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Process file uploads if attached
    const images = [];
    const attachments = [];

    if (req.files) {
      if (req.files.images) {
        req.files.images.forEach(f => images.push(`/uploads/${f.filename}`));
      }
      if (req.files.attachments) {
        req.files.attachments.forEach(f => attachments.push({
          filename: f.originalname,
          fileUrl: `/uploads/${f.filename}`,
          fileType: f.mimetype
        }));
      }
    }

    // Single file support fallback
    if (req.file) {
      if (req.file.mimetype.startsWith('image/')) {
        images.push(`/uploads/${req.file.filename}`);
      } else {
        attachments.push({
          filename: req.file.originalname,
          fileUrl: `/uploads/${req.file.filename}`,
          fileType: req.file.mimetype
        });
      }
    }

    // Build poll structure if postType === 'poll'
    let poll = undefined;
    if (postType === 'poll') {
      let rawOptions = [];
      if (typeof pollOptions === 'string') {
        try { rawOptions = JSON.parse(pollOptions); } catch (e) { rawOptions = pollOptions.split(','); }
      } else if (Array.isArray(pollOptions)) {
        rawOptions = pollOptions;
      }

      const parsedOptions = rawOptions.map((opt, i) => ({
        optionId: `opt_${Date.now()}_${i}`,
        text: typeof opt === 'object' ? opt.text : opt.toString().trim(),
        image: typeof opt === 'object' ? opt.image : '',
        votesCount: 0
      })).filter(o => o.text);

      if (parsedOptions.length < 2) {
        return res.status(400).json({ message: 'Polls must contain at least 2 options' });
      }

      const days = Number(pollDurationDays) || 7;
      const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

      poll = {
        question: title,
        options: parsedOptions,
        durationDays: days,
        expiresAt,
        allowMultiple: Boolean(pollAllowMultiple),
        isAnonymous: Boolean(pollIsAnonymous),
        isClosed: false,
        totalVotes: 0
      };
    }

    // Format tags
    let processedTags = [];
    if (typeof tags === 'string') {
      processedTags = tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    } else if (Array.isArray(tags)) {
      processedTags = tags.map(t => t.toString().trim().toLowerCase()).filter(Boolean);
    }

    const authorModel = req.user.constructor?.modelName || (req.user.role === 'admin' ? 'User' : 'Student');

    const post = await CommunityPost.create({
      postType: postType || 'discussion',
      title: title.trim(),
      content: content.trim(),
      author: studentId,
      authorModel,
      isAnonymous: Boolean(isAnonymous),
      category: category || 'General Discussion',
      subject: subject || 'General',
      difficulty: difficulty || 'N/A',
      tags: processedTags,
      images,
      attachments,
      poll,
      trendingScore: 10
    });

    const populatedPost = await CommunityPost.findById(post._id).populate('author', 'name photo school grade');

    // Socket.io Real-time event trigger
    if (req.io) {
      req.io.emit('community_new_post', { post: populatedPost });
    }

    return res.status(201).json({
      success: true,
      message: 'Community post created successfully!',
      post: populatedPost
    });

  } catch (error) {
    console.error('createPost Error:', error);
    return res.status(500).json({ message: error.message || 'Server error creating post' });
  }
};

/**
 * @desc    Get Feed Posts with Filters, Search, and Pagination
 * @route   GET /api/community/posts
 * @access  Public / Private
 */
const getAllPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 15,
      search,
      filter = 'latest',
      postType,
      category,
      subject,
      difficulty,
      tag,
      unanswered
    } = req.query;

    const query = { status: 'active' };

    if (postType && postType !== 'all' && postType !== 'undefined') {
      query.postType = postType;
    }

    if (category && category !== 'All' && category !== 'undefined') {
      query.category = category;
    }

    if (subject && subject !== 'All' && subject !== 'undefined') {
      query.subject = subject;
    }

    if (difficulty && difficulty !== 'All' && difficulty !== 'undefined') {
      query.difficulty = difficulty;
    }

    if (tag) {
      query.tags = tag.toLowerCase().trim();
    }

    if (unanswered === 'true') {
      query.postType = 'doubt';
      query.answersCount = 0;
    }

    // Text search
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
        { category: searchRegex },
        { subject: searchRegex }
      ];
    }

    // Filter by User's Saved Posts or User's Own Posts
    let userId = req.user ? req.user._id : null;
    if (!userId && (req.query.studentEmail || req.headers['x-student-email'])) {
      const emailToFind = (req.query.studentEmail || req.headers['x-student-email']).toLowerCase().trim();
      const studentDoc = await Student.findOne({ email: emailToFind });
      if (studentDoc) {
        userId = studentDoc._id;
      } else {
        const userDoc = await User.findOne({ email: emailToFind });
        if (userDoc) userId = userDoc._id;
      }
    }

    if (filter === 'saved') {
      if (userId) {
        const savedDocs = await CommunitySavedPost.find({ user: userId });
        const savedPostIds = savedDocs.map(s => s.post);
        query._id = { $in: savedPostIds };
      } else {
        query._id = { $in: [] }; // No saved posts for guest
      }
    } else if (filter === 'my_posts') {
      if (userId) {
        query.author = userId;
      } else {
        query.author = new mongoose.Types.ObjectId(); // Empty result for guest
      }
    }

    // Sorting strategy: Latest posts (createdAt: -1) always on top by default
    let sort = { createdAt: -1 };
    if (filter === 'trending') {
      sort = { trendingScore: -1, createdAt: -1 };
    } else if (filter === 'unanswered') {
      sort = { createdAt: -1 };
      query.answersCount = 0;
    } else if (filter === 'most_viewed') {
      sort = { viewsCount: -1, createdAt: -1 };
    } else if (filter === 'most_answered') {
      sort = { answersCount: -1, createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await CommunityPost.countDocuments(query);

    const posts = await CommunityPost.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('author', 'name photo school grade')
      .populate('bestAnswer');

    // Fetch user's saved status & user reactions if logged in
    let savedSet = new Set();
    let reactionMap = {};
    let pollVoteMap = {};

    if (userId) {
      const savedList = await CommunitySavedPost.find({ user: userId });
      savedList.forEach(s => savedSet.add(s.post.toString()));

      const reactionList = await CommunityReaction.find({ user: userId, targetType: 'post' });
      reactionList.forEach(r => { reactionMap[r.targetId.toString()] = r.type; });

      const pollVoteList = await CommunityPollVote.find({ user: userId });
      pollVoteList.forEach(pv => { pollVoteMap[pv.post.toString()] = pv.optionIds; });
    }

    // Format output with masked anonymous authors
    const formattedPosts = posts.map(p => {
      const postObj = p.toObject();
      postObj.author = maskAuthor(postObj.author, postObj.isAnonymous);
      postObj.isSaved = savedSet.has(postObj._id.toString());
      postObj.userReaction = reactionMap[postObj._id.toString()] || null;
      postObj.userPollVotes = pollVoteMap[postObj._id.toString()] || [];
      return postObj;
    });

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      posts: formattedPosts
    });

  } catch (error) {
    console.error('getAllPosts Error:', error);
    return res.status(500).json({ message: error.message || 'Server error fetching feed' });
  }
};

/**
 * @desc    Get Post Details by ID
 * @route   GET /api/community/posts/:id
 * @access  Public / Private
 */
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await CommunityPost.findById(id)
      .populate('author', 'name photo school grade')
      .populate({
        path: 'bestAnswer',
        populate: { path: 'author', select: 'name photo school grade' }
      });

    if (!post || post.status === 'deleted') {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count & calculate trending score
    post.viewsCount += 1;
    post.trendingScore += 1;
    await post.save();

    const userId = req.user ? req.user._id : null;
    let isSaved = false;
    let userReaction = null;
    let userPollVotes = [];

    if (userId) {
      const savedDoc = await CommunitySavedPost.findOne({ user: userId, post: post._id });
      isSaved = Boolean(savedDoc);

      const reactDoc = await CommunityReaction.findOne({ user: userId, targetId: post._id, targetType: 'post' });
      if (reactDoc) userReaction = reactDoc.type;

      const voteDoc = await CommunityPollVote.findOne({ user: userId, post: post._id });
      if (voteDoc) userPollVotes = voteDoc.optionIds;
    }

    const postObj = post.toObject();
    postObj.author = maskAuthor(postObj.author, postObj.isAnonymous);
    postObj.isSaved = isSaved;
    postObj.userReaction = userReaction;
    postObj.userPollVotes = userPollVotes;

    return res.status(200).json({ success: true, post: postObj });

  } catch (error) {
    console.error('getPostById Error:', error);
    return res.status(500).json({ message: error.message || 'Server error fetching post' });
  }
};

/**
 * @desc    Submit an Answer to a Question Post
 * @route   POST /api/community/posts/:id/answers
 * @access  Private (Protect)
 */
const createAnswer = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { id } = req.params;
    const { content, isAnonymous, codeSnippets } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Answer content is required' });
    }

    const post = await CommunityPost.findById(id);
    if (!post || post.status === 'deleted') {
      return res.status(404).json({ message: 'Question post not found' });
    }

    if (post.isLocked) {
      return res.status(400).json({ message: 'Discussion thread is locked for new answers' });
    }

    // Process attachments
    const images = [];
    const attachments = [];
    if (req.files) {
      if (req.files.images) req.files.images.forEach(f => images.push(`/uploads/${f.filename}`));
      if (req.files.attachments) {
        req.files.attachments.forEach(f => attachments.push({
          filename: f.originalname,
          fileUrl: `/uploads/${f.filename}`
        }));
      }
    }

    const authorModel = req.user.constructor?.modelName || (req.user.role === 'admin' ? 'User' : 'Student');

    const answer = await CommunityAnswer.create({
      post: post._id,
      author: studentId,
      authorModel,
      isAnonymous: Boolean(isAnonymous),
      content: content.trim(),
      codeSnippets: Array.isArray(codeSnippets) ? codeSnippets : [],
      images,
      attachments
    });

    // Update post stats
    post.answersCount += 1;
    post.trendingScore += 15;
    await post.save();

    const populatedAnswer = await CommunityAnswer.findById(answer._id).populate('author', 'name photo school grade');

    // Create Notification for Post Author
    if (post.author.toString() !== studentId.toString()) {
      await CommunityNotification.create({
        recipient: post.author,
        sender: studentId,
        type: 'answer',
        post: post._id,
        message: `${req.user.name || 'A student'} answered your doubt "${post.title.substring(0, 40)}..."`
      });
    }

    if (req.io) {
      req.io.emit(`post_new_answer_${id}`, { answer: populatedAnswer });
    }

    return res.status(201).json({
      success: true,
      message: 'Answer submitted successfully!',
      answer: populatedAnswer
    });

  } catch (error) {
    console.error('createAnswer Error:', error);
    return res.status(500).json({ message: error.message || 'Server error submitting answer' });
  }
};

/**
 * @desc    Get Answers for a Post
 * @route   GET /api/community/posts/:id/answers
 * @access  Public / Private
 */
const getAnswersByPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user._id : null;

    const answers = await CommunityAnswer.find({ post: id, status: 'active' })
      .sort({ isBestAnswer: -1, netUpvotes: -1, createdAt: 1 })
      .populate('author', 'name photo school grade');

    // Format output
    const formattedAnswers = answers.map(ans => {
      const ansObj = ans.toObject();
      ansObj.author = maskAuthor(ansObj.author, ansObj.isAnonymous);
      ansObj.hasUpvoted = userId ? ans.upvotes.some(uid => uid.toString() === userId.toString()) : false;
      ansObj.hasDownvoted = userId ? ans.downvotes.some(uid => uid.toString() === userId.toString()) : false;
      return ansObj;
    });

    return res.status(200).json({ success: true, answers: formattedAnswers });

  } catch (error) {
    console.error('getAnswersByPost Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Mark Answer as Best Answer (Question Author Only)
 * @route   PUT /api/community/answers/:id/best
 * @access  Private (Protect)
 */
const markBestAnswer = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { id } = req.params;

    const answer = await CommunityAnswer.findById(id).populate('post');
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const post = await CommunityPost.findById(answer.post._id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== studentId.toString()) {
      return res.status(403).json({ message: 'Only the question author can mark the best answer' });
    }

    // Reset previous best answer if any
    await CommunityAnswer.updateMany({ post: post._id }, { $set: { isBestAnswer: false } });

    answer.isBestAnswer = true;
    await answer.save();

    post.bestAnswer = answer._id;
    await post.save();

    // Create Notification
    if (answer.author.toString() !== studentId.toString()) {
      await CommunityNotification.create({
        recipient: answer.author,
        sender: studentId,
        type: 'best_answer',
        post: post._id,
        message: `🏆 Your answer was marked as the BEST ANSWER for "${post.title.substring(0, 40)}..."`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Marked as Best Answer! 🏆',
      bestAnswerId: answer._id
    });

  } catch (error) {
    console.error('markBestAnswer Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Upvote or Downvote an Answer
 * @route   POST /api/community/answers/:id/vote
 * @access  Private (Protect)
 */
const voteAnswer = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { id } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'

    const answer = await CommunityAnswer.findById(id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const upIndex = answer.upvotes.findIndex(uid => uid.toString() === studentId.toString());
    const downIndex = answer.downvotes.findIndex(uid => uid.toString() === studentId.toString());

    if (voteType === 'upvote') {
      if (upIndex > -1) {
        answer.upvotes.splice(upIndex, 1); // toggle off
      } else {
        answer.upvotes.push(studentId);
        if (downIndex > -1) answer.downvotes.splice(downIndex, 1);
      }
    } else if (voteType === 'downvote') {
      if (downIndex > -1) {
        answer.downvotes.splice(downIndex, 1); // toggle off
      } else {
        answer.downvotes.push(studentId);
        if (upIndex > -1) answer.upvotes.splice(upIndex, 1);
      }
    }

    answer.netUpvotes = answer.upvotes.length - answer.downvotes.length;
    await answer.save();

    return res.status(200).json({
      success: true,
      netUpvotes: answer.netUpvotes,
      upvotesCount: answer.upvotes.length,
      downvotesCount: answer.downvotes.length,
      hasUpvoted: answer.upvotes.some(uid => uid.toString() === studentId.toString()),
      hasDownvoted: answer.downvotes.some(uid => uid.toString() === studentId.toString())
    });

  } catch (error) {
    console.error('voteAnswer Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create Comment or Nested Reply
 * @route   POST /api/community/comments
 * @access  Private (Protect)
 */
const createComment = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { targetType, targetId, parentId, content, isAnonymous } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    let depth = 0;
    if (parentId) {
      const parentComment = await CommunityComment.findById(parentId);
      if (parentComment) {
        depth = (parentComment.depth || 0) + 1;
        parentComment.repliesCount += 1;
        await parentComment.save();
      }
    }

    const authorModel = req.user.constructor?.modelName || (req.user.role === 'admin' ? 'User' : 'Student');

    const comment = await CommunityComment.create({
      targetType: targetType || 'post',
      targetId,
      parentId: parentId || null,
      depth,
      author: studentId,
      authorModel,
      isAnonymous: Boolean(isAnonymous),
      content: content.trim()
    });

    // Update parent post/answer comment count
    if (targetType === 'post') {
      await CommunityPost.findByIdAndUpdate(targetId, { $inc: { commentsCount: 1, trendingScore: 5 } });
    }

    const populatedComment = await CommunityComment.findById(comment._id).populate('author', 'name photo school grade');

    return res.status(201).json({
      success: true,
      comment: {
        ...populatedComment.toObject(),
        author: maskAuthor(populatedComment.author, Boolean(isAnonymous))
      }
    });

  } catch (error) {
    console.error('createComment Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get Threaded Comments & Nested Replies
 * @route   GET /api/community/comments
 * @access  Public / Private
 */
const getComments = async (req, res) => {
  try {
    const { targetType, targetId } = req.query;
    const userId = req.user ? req.user._id : null;

    const comments = await CommunityComment.find({ targetType, targetId, status: 'active' })
      .sort({ createdAt: 1 })
      .populate('author', 'name photo school grade');

    // Get user reactions
    let userReactionMap = {};
    if (userId) {
      const commentIds = comments.map(c => c._id);
      const reactions = await CommunityReaction.find({ user: userId, targetId: { $in: commentIds }, targetType: 'comment' });
      reactions.forEach(r => { userReactionMap[r.targetId.toString()] = r.type; });
    }

    const formattedComments = comments.map(c => {
      const cObj = c.toObject();
      cObj.author = maskAuthor(cObj.author, cObj.isAnonymous);
      cObj.userReaction = userReactionMap[cObj._id.toString()] || null;
      return cObj;
    });

    return res.status(200).json({ success: true, comments: formattedComments });

  } catch (error) {
    console.error('getComments Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    React to Post, Answer, or Comment (👍, ❤️, 🎉, 💡, 👏, 😂)
 * @route   POST /api/community/reactions
 * @access  Private (Protect)
 */
const reactToItem = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { targetType, targetId, type } = req.body; // type: like, love, celebrate, helpful, appreciate, funny

    if (!['like', 'love', 'celebrate', 'helpful', 'appreciate', 'funny'].includes(type)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    let existing = await CommunityReaction.findOne({ targetType, targetId, user: studentId });
    let isRemoved = false;
    let oldType = null;

    if (existing) {
      oldType = existing.type;
      if (existing.type === type) {
        // Toggle off reaction
        await CommunityReaction.findByIdAndDelete(existing._id);
        isRemoved = true;
      } else {
        // Switch reaction
        existing.type = type;
        await existing.save();
      }
    } else {
      await CommunityReaction.create({ targetType, targetId, user: studentId, type });
    }

    // Update target document reaction counters
    let Model = CommunityPost;
    if (targetType === 'answer') Model = CommunityAnswer;
    if (targetType === 'comment') Model = CommunityComment;

    const targetDoc = await Model.findById(targetId);
    if (targetDoc && targetDoc.reactionsCount) {
      if (oldType && targetDoc.reactionsCount[oldType] > 0) {
        targetDoc.reactionsCount[oldType] = Math.max(0, targetDoc.reactionsCount[oldType] - 1);
      }
      if (!isRemoved) {
        targetDoc.reactionsCount[type] = (targetDoc.reactionsCount[type] || 0) + 1;
      }
      if (targetType === 'post') targetDoc.trendingScore += isRemoved ? -3 : 5;
      await targetDoc.save();
    }

    return res.status(200).json({
      success: true,
      reactionsCount: targetDoc?.reactionsCount || {},
      userReaction: isRemoved ? null : type
    });

  } catch (error) {
    console.error('reactToItem Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Vote in an Interactive Poll
 * @route   POST /api/community/posts/:id/poll/vote
 * @access  Private (Protect)
 */
const votePoll = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { id } = req.params;
    const { optionIds, isAnonymous } = req.body;

    if (!Array.isArray(optionIds) || optionIds.length === 0) {
      return res.status(400).json({ message: 'Please select an option to vote' });
    }

    const post = await CommunityPost.findById(id);
    if (!post || !post.poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    if (post.poll.isClosed || (post.poll.expiresAt && new Date() > new Date(post.poll.expiresAt))) {
      post.poll.isClosed = true;
      await post.save();
      return res.status(400).json({ message: 'This poll has ended and is closed for voting' });
    }

    const existingVote = await CommunityPollVote.findOne({ post: post._id, user: studentId });
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted in this poll' });
    }

    await CommunityPollVote.create({
      post: post._id,
      user: studentId,
      optionIds,
      isAnonymous: Boolean(isAnonymous)
    });

    // Update poll counts
    post.poll.options.forEach(opt => {
      if (optionIds.includes(opt.optionId)) {
        opt.votesCount += 1;
      }
    });

    post.poll.totalVotes += 1;
    post.trendingScore += 10;
    await post.save();

    return res.status(200).json({
      success: true,
      message: 'Vote submitted successfully! 🗳️',
      poll: post.poll,
      userPollVotes: optionIds
    });

  } catch (error) {
    console.error('votePoll Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Toggle Bookmark / Save Post
 * @route   POST /api/community/posts/:id/save
 * @access  Private (Protect)
 */
const toggleSavePost = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { id } = req.params;

    const existing = await CommunitySavedPost.findOne({ user: studentId, post: id });
    let isSaved = false;

    if (existing) {
      await CommunitySavedPost.findByIdAndDelete(existing._id);
      isSaved = false;
    } else {
      await CommunitySavedPost.create({ user: studentId, post: id });
      isSaved = true;
    }

    return res.status(200).json({
      success: true,
      isSaved,
      message: isSaved ? 'Post saved to your bookmarks 🔖' : 'Post removed from saved bookmarks'
    });

  } catch (error) {
    console.error('toggleSavePost Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get User Community Reputation & Gamification Stats
 * @route   GET /api/community/profile
 * @access  Private (Protect)
 */
const getUserCommunityProfile = async (req, res) => {
  try {
    const studentId = req.user._id;

    const totalPosts = await CommunityPost.countDocuments({ author: studentId, status: 'active' });
    const totalAnswers = await CommunityAnswer.countDocuments({ author: studentId, status: 'active' });
    const bestAnswersCount = await CommunityAnswer.countDocuments({ author: studentId, isBestAnswer: true });
    
    // Total reactions received on user posts & answers
    const userPostIds = await CommunityPost.find({ author: studentId }).select('_id');
    const userAnsIds = await CommunityAnswer.find({ author: studentId }).select('_id');
    const allTargetIds = [...userPostIds.map(p => p._id), ...userAnsIds.map(a => a._id)];

    const totalReactionsReceived = await CommunityReaction.countDocuments({ targetId: { $in: allTargetIds } });

    // Calculate reputation XP score
    const reputationScore = (totalPosts * 5) + (totalAnswers * 10) + (bestAnswersCount * 50) + (totalReactionsReceived * 2);

    const stats = {
      totalPosts,
      totalAnswers,
      bestAnswersCount,
      totalReactionsReceived,
      reputationScore
    };

    const badges = calculateUserBadges(stats);

    return res.status(200).json({
      success: true,
      profile: {
        stats,
        badges,
        xpLevel: Math.floor(reputationScore / 50) + 1,
        nextLevelXp: ((Math.floor(reputationScore / 50) + 1) * 50) - reputationScore
      }
    });

  } catch (error) {
    console.error('getUserCommunityProfile Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  createAnswer,
  getAnswersByPost,
  markBestAnswer,
  voteAnswer,
  createComment,
  getComments,
  reactToItem,
  votePoll,
  toggleSavePost,
  getUserCommunityProfile
};
