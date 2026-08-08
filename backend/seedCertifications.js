require('dotenv').config();
const mongoose = require('mongoose');
const Certification = require('./models/Certification');
const CertModule = require('./models/CertModule');
const CertLesson = require('./models/CertLesson');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/piyushdhara';

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('🌱 Connected to MongoDB for Full 15-Module Certification Curriculum Seeding...');

    // Clear existing certification data for clean refresh
    const existingCert = await Certification.findOne({ slug: 'html-mastery-beginner-to-advanced' });
    if (existingCert) {
      console.log('🗑️ Clearing prior certification modules & lessons...');
      const modules = await CertModule.find({ certificationId: existingCert._id });
      const modIds = modules.map(m => m._id);
      await CertLesson.deleteMany({ moduleId: { $in: modIds } });
      await CertModule.deleteMany({ certificationId: existingCert._id });
      await Certification.deleteOne({ _id: existingCert._id });
    }

    // 1. Create Master Certification Document
    const htmlCert = await Certification.create({
      title: 'HTML Mastery: Beginner to Advanced',
      subtitle: 'Complete 15-Module Professional Certification Course (Web Development, Semantic Web, Forms, Accessibility, SEO & Advanced HTML5 APIs)',
      slug: 'html-mastery-beginner-to-advanced',
      description: 'The definitive 15-module professional certification course prepared by Pankaj Baduwal for web developers. Master HTML5 from absolute fundamentals to modern semantic web architecture, form validation, WCAG accessibility, SEO meta tags, canvas APIs, local storage, responsive media, and full capstone projects.',
      thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      category: 'Web Development',
      difficulty: 'Beginner',
      price: 299,
      isPaid: true,
      estimatedDuration: '24 Hours',
      language: 'English & Nepali',
      instructor: {
        name: 'Pankaj Baduwal',
        designation: 'Lead Educator & Engineer',
        photo: '/pankaj-baduwal.jpg',
        bio: 'Lead computer science educator and engineer at PiyushDhara Prep Portal with extensive experience mentoring web development students.'
      },
      prerequisites: [
        'No prior coding or web design experience required.',
        'Basic computer literacy and internet browsing skills.',
        'A computer with VS Code or any modern text editor installed.'
      ],
      learningOutcomes: [
        'Understand client-server architecture and how browsers render HTML DOM trees',
        'Master standard HTML document boilerplate, doctypes, and viewport tags',
        'Structure rich textual content with headings, paragraphs, lists, and quotes',
        'Create interactive navigation systems with relative and absolute hyperlinks',
        'Embed multimedia including responsive images, audio, HTML5 video, and iFrames',
        'Build complex data tables with rowspans, colspans, and accessible captions',
        'Design interactive web forms using HTML5 input types and native client validation',
        'Implement semantic HTML5 tags (<header>, <nav>, <main>, <article>, <section>, <footer>)',
        'Ensure web accessibility (a11y) using ARIA roles, screen-reader standards, and alt text',
        'Optimize meta tags for Search Engine Optimization (SEO) & social media preview cards',
        'Apply responsive image techniques using <picture>, srcset, and lazy loading',
        'Utilize advanced HTML5 Web Storage (localStorage & sessionStorage) and Canvas APIs',
        'Follow W3C markup validation and clean coding standards',
        'Build 3 complete real-world portfolio capstone projects'
      ],
      skillsGained: [
        'HTML5 Semantic Markup',
        'Form Validation & Controls',
        'Web Accessibility (WCAG & ARIA)',
        'SEO & Open Graph Meta Tags',
        'Responsive Media & Art Direction',
        'HTML5 Canvas & Web Storage',
        'W3C Standards & Best Practices'
      ],
      certificateInfo: {
        title: 'Certified Professional HTML5 Web Developer',
        issuer: 'Pankaj Baduwal & Technical Team — PiyushDhara Learning Academy',
        minPassingPercentage: 70
      }
    });

    console.log(`✅ Certification created: ${htmlCert.title}`);

    // Data structure for all 15 modules with complete curriculum content
    const modulesData = [
      {
        order: 1,
        title: 'Introduction to Web Development & HTML5',
        description: 'Understand web architecture, DNS, client-server models, HTML tag syntax, DOM trees, and VS Code setup.',
        estimatedTimeMinutes: 45,
        lessons: [
          {
            title: 'Introduction to Web Architecture & HTML Tag Syntax',
            order: 1,
            estimatedTimeMinutes: 20,
            contentHtml: `
              <h3>1.1 How the Internet Works</h3>
              <p>The internet is a global network of computers that communicate with each other. When you type a URL in your browser, here's what happens step by step:</p>
              <ol>
                <li><strong>DNS Lookup:</strong> Your browser asks a DNS (Domain Name System) server to convert the domain name (e.g., <code>google.com</code>) into an IP address (e.g., <code>142.250.64.78</code>).</li>
                <li><strong>TCP Connection:</strong> Your browser establishes a connection with the server using TCP/IP protocols.</li>
                <li><strong>HTTP Request:</strong> The browser sends an HTTP (HyperText Transfer Protocol) request to the server asking for the webpage.</li>
                <li><strong>Server Response:</strong> The server sends back HTML, CSS, and JavaScript files.</li>
                <li><strong>Rendering:</strong> Your browser reads and renders the files to display the webpage.</li>
              </ol>

              <h4>Key Protocols:</h4>
              <ul>
                <li><strong>HTTP/HTTPS:</strong> How data is transferred between browser and server</li>
                <li><strong>TCP/IP:</strong> The underlying network communication rules</li>
                <li><strong>DNS:</strong> Converts domain names to IP addresses</li>
              </ul>

              <hr />

              <h3>1.2 Client-Server Architecture</h3>
              <p>The web runs on a <strong>client-server model</strong>:</p>

              <table border="1" style="width:100%; border-collapse:collapse; margin-bottom:1rem; text-align:left;">
                <thead>
                  <tr style="background:#F8FAFC;">
                    <th style="padding:10px; border:1px solid #CBD5E1;">Client (Browser)</th>
                    <th style="padding:10px; border:1px solid #CBD5E1;">Server</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style="padding:8px; border:1px solid #E2E8F0;">Sends requests</td><td style="padding:8px; border:1px solid #E2E8F0;">Receives and processes requests</td></tr>
                  <tr><td style="padding:8px; border:1px solid #E2E8F0;">Displays HTML/CSS/JS</td><td style="padding:8px; border:1px solid #E2E8F0;">Stores and serves files</td></tr>
                  <tr><td style="padding:8px; border:1px solid #E2E8F0;">Chrome, Firefox, Safari</td><td style="padding:8px; border:1px solid #E2E8F0;">Apache, Nginx, Node.js</td></tr>
                  <tr><td style="padding:8px; border:1px solid #E2E8F0;">Runs on user's device</td><td style="padding:8px; border:1px solid #E2E8F0;">Runs on remote machines</td></tr>
                </tbody>
              </table>

              <h4>Frontend vs Backend:</h4>
              <ul>
                <li><strong>Frontend:</strong> What users see (HTML, CSS, JavaScript)</li>
                <li><strong>Backend:</strong> Server logic and databases (PHP, Python, Node.js, SQL)</li>
                <li><strong>HTML is a frontend technology</strong> — it defines the <em>structure</em> of a webpage.</li>
              </ul>

              <hr />

              <h3>1.3 What is HTML?</h3>
              <p>HTML stands for <strong>HyperText Markup Language</strong>. It is:</p>
              <ul>
                <li>The standard language for creating webpages</li>
                <li>Not a programming language — it's a <em>markup</em> language</li>
                <li>Made up of <strong>elements</strong> represented by <strong>tags</strong></li>
                <li>Read and rendered by web browsers</li>
              </ul>

              <h4>History of HTML:</h4>
              <ul>
                <li><strong>HTML 1.0 (1993):</strong> Basic text and links</li>
                <li><strong>HTML 4.01 (1999):</strong> Tables, forms, frames</li>
                <li><strong>XHTML (2000):</strong> Stricter XML-based HTML</li>
                <li><strong>HTML5 (2014–present):</strong> Semantic elements, multimedia, APIs</li>
              </ul>

              <hr />

              <h3>1.4 HTML Tag Syntax</h3>
              <p>Every HTML element follows this structure:</p>
              <pre><code>&lt;tagname attribute="value"&gt;Content goes here&lt;/tagname&gt;</code></pre>

              <p><strong>Parts of an HTML element:</strong></p>
              <ul>
                <li><code>&lt;tagname&gt;</code> — Opening tag — starts the element</li>
                <li><code>&lt;/tagname&gt;</code> — Closing tag — ends the element</li>
                <li><code>attribute="value"</code> — Extra information about the element</li>
                <li><code>Content</code> — Text or other elements inside</li>
              </ul>

              <h4>Self-Closing Tags (Void Elements):</h4>
              <p>Some tags have no content and close themselves:</p>
              <pre><code>&lt;br /&gt;       &lt;!-- Line break --&gt;
&lt;hr /&gt;       &lt;!-- Horizontal rule --&gt;
&lt;img /&gt;      &lt;!-- Image --&gt;
&lt;input /&gt;    &lt;!-- Form input --&gt;
&lt;meta /&gt;     &lt;!-- Metadata --&gt;
&lt;link /&gt;     &lt;!-- Link to external file --&gt;</code></pre>

              <hr />

              <h3>1.5 The HTML DOM (Document Object Model)</h3>
              <p>The <strong>DOM</strong> is a tree-like representation of an HTML document. The browser builds this tree when it reads your HTML, and JavaScript can interact with it.</p>

              <pre style="background:#0F172A; color:#38BDF8; padding:1.25rem; border-radius:0.85rem; font-family:monospace;"><code>Document
└── html
    ├── head
    │   ├── title
    │   └── meta
    └── body
        ├── h1
        ├── p
        └── div
            ├── p
            └── a</code></pre>
              <p>Every HTML element becomes a <strong>node</strong> in this tree. Parent-child relationships matter for CSS and JavaScript.</p>

              <hr />

              <h3>1.6 Setting Up VS Code</h3>
              <ol>
                <li><strong>Step 1: Download VS Code:</strong> Go to <a href="https://code.visualstudio.com" target="_blank" rel="noopener noreferrer">https://code.visualstudio.com</a> and install for your OS.</li>
                <li><strong>Step 2: Install Extensions:</strong>
                  <ul>
                    <li><strong>Live Server</strong> – Launches a local server with live reload</li>
                    <li><strong>Prettier</strong> – Auto-formats your code</li>
                    <li><strong>HTML CSS Support</strong> – Autocomplete for HTML/CSS</li>
                  </ul>
                </li>
                <li><strong>Step 3: Create Your First File:</strong>
                  <ul>
                    <li>Open VS Code</li>
                    <li>File → New File → Save as <code>index.html</code></li>
                    <li>Type <code>!</code> and press Tab — Emmet generates a full HTML boilerplate</li>
                  </ul>
                </li>
                <li><strong>Step 4: Launch with Live Server:</strong> Right-click <code>index.html</code> → "Open with Live Server"</li>
              </ol>
            `,
            codeSnippets: [
              {
                title: 'Basic HTML Tag Examples',
                language: 'html',
                code: `<h1>This is a Heading</h1>\n<p class="intro">This is a paragraph.</p>\n<a href="https://google.com">Click here</a>\n<img src="photo.jpg" alt="A photo" />`,
                explanation: 'Demonstrates headings, paragraphs, hyperlinks, and image tags.'
              }
            ],
            callouts: [
              { type: 'info', title: 'Key Protocols', content: 'HTTP/HTTPS transfers data between browser and server. DNS converts domain names to IP addresses.' }
            ],
            hasQuiz: true,
            quiz: {
              title: 'Module 1, Lesson 1 Checkpoint Quiz (5 Questions)',
              passingPercentage: 70,
              questions: [
                {
                  questionText: 'Q1. What does HTML stand for?',
                  type: 'mcq',
                  options: ['A) HyperText Markup Language', 'B) HyperText Making Language', 'C) HighText Markup Language', 'D) HyperTransfer Markup Language'],
                  correctAnswers: ['A) HyperText Markup Language'],
                  explanation: 'HTML stands for HyperText Markup Language.'
                },
                {
                  questionText: 'Q2. Which protocol converts a domain name to an IP address?',
                  type: 'mcq',
                  options: ['A) HTTP', 'B) TCP', 'C) DNS', 'D) FTP'],
                  correctAnswers: ['C) DNS'],
                  explanation: 'DNS (Domain Name System) maps human-readable domain names to numerical IP addresses.'
                },
                {
                  questionText: 'Q3. What is the correct syntax for an HTML element with an attribute?',
                  type: 'mcq',
                  options: ['A) <tagname>attribute="value"</tagname>', 'B) <tagname attribute="value">Content</tagname>', 'C) <tagname(attribute="value")>Content</tagname>', 'D) [tagname attribute="value"]Content[/tagname]'],
                  correctAnswers: ['B) <tagname attribute="value">Content</tagname>'],
                  explanation: 'Attributes are placed inside the opening tag after the tag name.'
                },
                {
                  questionText: 'Q4. Which of the following is a self-closing (void) tag?',
                  type: 'mcq',
                  options: ['A) <p>', 'B) <div>', 'C) <img />', 'D) <section>'],
                  correctAnswers: ['C) <img />'],
                  explanation: 'Image (<img />) tags do not contain closing tags or internal content text.'
                },
                {
                  questionText: 'Q5. What does the DOM stand for?',
                  type: 'mcq',
                  options: ['A) Document Object Model', 'B) Data Object Management', 'C) Document Operation Markup', 'D) Digital Object Model'],
                  correctAnswers: ['A) Document Object Model'],
                  explanation: 'DOM stands for Document Object Model, representing the HTML tree structure.'
                }
              ]
            }
          },
          {
            title: 'HTML Boilerplate, Meta Tags & Document Head',
            order: 2,
            estimatedTimeMinutes: 25,
            contentHtml: `
              <h3>2.1 The HTML5 Boilerplate</h3>
              <p>Every HTML document starts with a standard structure called the boilerplate:</p>
              <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8" /&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;
  &lt;title&gt;My Webpage&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;

  &lt;h1&gt;Hello, World!&lt;/h1&gt;

&lt;/body&gt;
&lt;/html&gt;</code></pre>

              <p>Let's break down each part:</p>

              <h3>2.2 DOCTYPE Declaration</h3>
              <pre><code>&lt;!DOCTYPE html&gt;</code></pre>
              <ul>
                <li>Tells the browser this is an <strong>HTML5</strong> document</li>
                <li>Must be the very <strong>first line</strong> — before anything else</li>
                <li>Not an HTML tag — it's an instruction to the browser</li>
                <li>In older HTML versions this was long and complex; HTML5 simplified it</li>
              </ul>

              <h3>2.3 The &lt;html&gt; Element</h3>
              <pre><code>&lt;html lang="en"&gt;</code></pre>
              <ul>
                <li>The <strong>root element</strong> — everything else lives inside it</li>
                <li><code>lang="en"</code> declares the page language (important for accessibility and SEO)</li>
                <li>Use language codes: <code>en</code> (English), <code>ne</code> (Nepali), <code>fr</code> (French), etc.</li>
              </ul>

              <h3>2.4 The &lt;head&gt; Element</h3>
              <p>The <code>&lt;head&gt;</code> contains <strong>metadata</strong> — information about the page that is NOT displayed on screen.</p>

              <pre><code>&lt;head&gt;
  &lt;meta charset="UTF-8" /&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;
  &lt;meta name="description" content="Learn HTML from scratch" /&gt;
  &lt;meta name="author" content="Pankaj Baduwal" /&gt;
  &lt;title&gt;HTML Mastery Course&lt;/title&gt;
  &lt;link rel="stylesheet" href="style.css" /&gt;
  &lt;link rel="icon" href="favicon.ico" /&gt;
&lt;/head&gt;</code></pre>

              <h4>Key Meta Tags Explained:</h4>
              <table border="1" style="width:100%; border-collapse:collapse; margin-bottom:1rem; text-align:left;">
                <thead>
                  <tr style="background:#F8FAFC;">
                    <th style="padding:10px; border:1px solid #CBD5E1;">Tag</th>
                    <th style="padding:10px; border:1px solid #CBD5E1;">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style="padding:8px; border:1px solid #E2E8F0;"><code>&lt;meta charset="UTF-8"&gt;</code></td><td style="padding:8px; border:1px solid #E2E8F0;">Supports all characters including Nepali, emojis</td></tr>
                  <tr><td style="padding:8px; border:1px solid #E2E8F0;"><code>&lt;meta name="viewport"...&gt;</code></td><td style="padding:8px; border:1px solid #E2E8F0;">Makes page responsive on mobile devices</td></tr>
                  <tr><td style="padding:8px; border:1px solid #E2E8F0;"><code>&lt;meta name="description"...&gt;</code></td><td style="padding:8px; border:1px solid #E2E8F0;">Search engine result description</td></tr>
                  <tr><td style="padding:8px; border:1px solid #E2E8F0;"><code>&lt;meta name="author"...&gt;</code></td><td style="padding:8px; border:1px solid #E2E8F0;">Page author name</td></tr>
                  <tr><td style="padding:8px; border:1px solid #E2E8F0;"><code>&lt;title&gt;</code></td><td style="padding:8px; border:1px solid #E2E8F0;">Browser tab title and SEO title</td></tr>
                </tbody>
              </table>

              <h3>2.5 The &lt;body&gt; Element</h3>
              <pre><code>&lt;body&gt;
  &lt;!-- All visible content goes here --&gt;
  &lt;h1&gt;Welcome!&lt;/h1&gt;
  &lt;p&gt;This is my first webpage.&lt;/p&gt;
&lt;/body&gt;</code></pre>
              <ul>
                <li>Everything users <strong>see on screen</strong> goes inside <code>&lt;body&gt;</code></li>
                <li>Text, images, links, forms, videos — all go here</li>
                <li>HTML comments use <code>&lt;!-- comment --&gt;</code> syntax and are NOT shown on screen</li>
              </ul>

              <h3>2.6 HTML Comments</h3>
              <pre><code>&lt;!-- This is a comment and will not appear on the page --&gt;
&lt;p&gt;This paragraph will appear.&lt;/p&gt;
&lt;!-- TODO: Add navigation here --&gt;</code></pre>
              <p>Comments are useful for:</p>
              <ul>
                <li>Explaining your code</li>
                <li>Temporarily hiding content during development</li>
                <li>Leaving notes for yourself or team members</li>
              </ul>

              <h3>2.7 Linking External Files</h3>
              <pre><code>&lt;!-- Link CSS stylesheet --&gt;
&lt;link rel="stylesheet" href="style.css" /&gt;

&lt;!-- Link JavaScript file (placed at end of body) --&gt;
&lt;script src="script.js"&gt;&lt;/script&gt;

&lt;!-- Link a favicon (browser tab icon) --&gt;
&lt;link rel="icon" type="image/png" href="favicon.png" /&gt;</code></pre>
            `,
            codeSnippets: [
              {
                title: 'Full Head Section with External Links',
                language: 'html',
                code: `<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <meta name="description" content="Learn HTML from scratch" />\n  <meta name="author" content="Pankaj Baduwal" />\n  <title>HTML Mastery Course</title>\n  <link rel="stylesheet" href="style.css" />\n  <link rel="icon" href="favicon.ico" />\n</head>`,
                explanation: 'Standard head section linking external CSS, favicon, and SEO meta tags.'
              }
            ],
            callouts: [
              { type: 'warning', title: 'Critical Requirement', content: '<!DOCTYPE html> must be the very first line of any HTML5 document.' }
            ],
            hasQuiz: true,
            quiz: {
              title: 'Module 1, Lesson 2 Checkpoint Quiz (5 Questions)',
              passingPercentage: 70,
              questions: [
                {
                  questionText: 'Q1. Where must the <!DOCTYPE html> declaration appear?',
                  type: 'mcq',
                  options: ['A) Inside the <head> tag', 'B) After the <html> tag', 'C) As the very first line of the document', 'D) Inside the <body> tag'],
                  correctAnswers: ['C) As the very first line of the document'],
                  explanation: '<!DOCTYPE html> tells the browser the HTML version and must be on line 1.'
                },
                {
                  questionText: 'Q2. Which meta tag makes a webpage mobile-friendly?',
                  type: 'mcq',
                  options: ['A) <meta charset="UTF-8">', 'B) <meta name="viewport" content="width=device-width, initial-scale=1.0">', 'C) <meta name="description">', 'D) <meta name="author">'],
                  correctAnswers: ['B) <meta name="viewport" content="width=device-width, initial-scale=1.0">'],
                  explanation: 'The viewport meta tag configures rendering width to match physical mobile screen widths.'
                },
                {
                  questionText: 'Q3. What is the purpose of the <head> section in HTML?',
                  type: 'mcq',
                  options: ['A) To display the page header on screen', 'B) To contain metadata not shown on the page', 'C) To create the navigation bar', 'D) To define the page body'],
                  correctAnswers: ['B) To contain metadata not shown on the page'],
                  explanation: '<head> holds metadata, character encoding, title, scripts, and stylesheets.'
                },
                {
                  questionText: 'Q4. How do you write an HTML comment?',
                  type: 'mcq',
                  options: ['A) // This is a comment', 'B) /* This is a comment */', 'C) <!-- This is a comment -->', 'D) # This is a comment'],
                  correctAnswers: ['C) <!-- This is a comment -->'],
                  explanation: 'HTML comments use <!-- comment --> syntax.'
                },
                {
                  questionText: 'Q5. Which tag is used to set the browser tab title?',
                  type: 'mcq',
                  options: ['A) <meta name="title">', 'B) <header>', 'C) <h1>', 'D) <title>'],
                  correctAnswers: ['D) <title>'],
                  explanation: '<title> defines the text shown on the browser tab.'
                }
              ]
            }
          }
        ]
      },
      {
        order: 2,
        title: 'Text Elements & Formatting',
        description: 'Master headings, paragraphs, semantic vs visual text styling, quotations, preformatted text, divs, and spans.',
        estimatedTimeMinutes: 20,
        lessons: [
          {
            title: 'Headings, Paragraphs & Text Styling',
            order: 1,
            estimatedTimeMinutes: 20,
            contentHtml: `
              <h3>2.1 Headings — &lt;h1&gt; to &lt;h6&gt;</h3>
              <p>HTML provides six levels of headings:</p>
              <pre><code>&lt;h1&gt;Heading 1 — Main Title (Largest)&lt;/h1&gt;
&lt;h2&gt;Heading 2 — Section Title&lt;/h2&gt;
&lt;h3&gt;Heading 3 — Sub-section&lt;/h3&gt;
&lt;h4&gt;Heading 4&lt;/h4&gt;
&lt;h5&gt;Heading 5&lt;/h5&gt;
&lt;h6&gt;Heading 6 — Smallest Heading&lt;/h6&gt;</code></pre>

              <h4>Rules for Headings:</h4>
              <ul>
                <li>Only one <code>&lt;h1&gt;</code> per page (important for SEO)</li>
                <li>Use headings in hierarchical order — don't skip levels</li>
                <li>Headings communicate structure, not just size</li>
                <li>Screen readers use headings to navigate pages</li>
              </ul>

              <hr />

              <h3>2.2 Paragraphs — &lt;p&gt;</h3>
              <pre><code>&lt;p&gt;This is a paragraph. It contains a block of text.&lt;/p&gt;
&lt;p&gt;Each paragraph starts on a new line with automatic spacing.&lt;/p&gt;</code></pre>
              <ul>
                <li>Browsers automatically add space above and below <code>&lt;p&gt;</code> tags</li>
                <li>Whitespace inside HTML collapses — multiple spaces become one</li>
              </ul>

              <hr />

              <h3>2.3 Line Break &amp; Horizontal Rule</h3>
              <pre><code>&lt;p&gt;This is line one.&lt;br /&gt;This is line two in the same paragraph.&lt;/p&gt;

&lt;hr /&gt;  &lt;!-- Creates a horizontal dividing line --&gt;</code></pre>
              <ul>
                <li><code>&lt;br /&gt;</code> — Forces a line break within text (use sparingly)</li>
                <li><code>&lt;hr /&gt;</code> — Creates a thematic break/divider between sections</li>
              </ul>

              <hr />

              <h3>2.4 Text Formatting Tags</h3>
              <pre><code>&lt;!-- Bold (semantic importance) --&gt;
&lt;strong&gt;This text is important&lt;/strong&gt;

&lt;!-- Bold (visual only) --&gt;
&lt;b&gt;This text is bold&lt;/b&gt;

&lt;!-- Italic (semantic emphasis) --&gt;
&lt;em&gt;This text is emphasized&lt;/em&gt;

&lt;!-- Italic (visual only) --&gt;
&lt;i&gt;This text is italic&lt;/i&gt;

&lt;!-- Underline --&gt;
&lt;u&gt;This text is underlined&lt;/u&gt;

&lt;!-- Strikethrough --&gt;
&lt;s&gt;This text is crossed out&lt;/s&gt;
&lt;del&gt;This was deleted&lt;/del&gt;

&lt;!-- Superscript and Subscript --&gt;
&lt;p&gt;H&lt;sub&gt;2&lt;/sub&gt;O is water. E=mc&lt;sup&gt;2&lt;/sup&gt; is Einstein's equation.&lt;/p&gt;

&lt;!-- Highlighted text --&gt;
&lt;mark&gt;This text is highlighted&lt;/mark&gt;

&lt;!-- Small text --&gt;
&lt;small&gt;Copyright 2024&lt;/small&gt;

&lt;!-- Inline code --&gt;
&lt;code&gt;console.log("hello")&lt;/code&gt;</code></pre>

              <h4>Semantic vs Presentational:</h4>
              <ul>
                <li><code>&lt;strong&gt;</code> and <code>&lt;em&gt;</code> carry meaning (used by screen readers)</li>
                <li><code>&lt;b&gt;</code> and <code>&lt;i&gt;</code> are visual only — prefer <code>&lt;strong&gt;</code> and <code>&lt;em&gt;</code></li>
              </ul>

              <hr />

              <h3>2.5 Quotations</h3>
              <pre><code>&lt;!-- Block quote (long quotation from another source) --&gt;
&lt;blockquote cite="https://example.com"&gt;
  &lt;p&gt;"The best way to predict the future is to create it."&lt;/p&gt;
&lt;/blockquote&gt;

&lt;!-- Inline quote --&gt;
&lt;p&gt;He said &lt;q&gt;HTML is the backbone of the web.&lt;/q&gt;&lt;/p&gt;

&lt;!-- Citation / reference --&gt;
&lt;p&gt;&lt;cite&gt;HTML5 Specification&lt;/cite&gt; was published by W3C.&lt;/p&gt;

&lt;!-- Abbreviation with tooltip --&gt;
&lt;p&gt;&lt;abbr title="HyperText Markup Language"&gt;HTML&lt;/abbr&gt; is easy to learn.&lt;/p&gt;</code></pre>

              <hr />

              <h3>2.6 Preformatted Text — &lt;pre&gt;</h3>
              <pre style="background:#0F172A; color:#38BDF8; padding:1.25rem; border-radius:0.85rem; font-family:monospace;"><code>  This text
     preserves    all spacing
  and line breaks exactly.</code></pre>
              <ul>
                <li><code>&lt;pre&gt;</code> displays text in a fixed-width font</li>
                <li>Preserves all whitespace and line breaks</li>
                <li>Useful for code samples and ASCII art</li>
              </ul>

              <hr />

              <h3>2.7 &lt;div&gt; and &lt;span&gt; — Generic Containers</h3>
              <pre><code>&lt;!-- Block-level container (takes full width) --&gt;
&lt;div class="card"&gt;
  &lt;h2&gt;Card Title&lt;/h2&gt;
  &lt;p&gt;Card content here.&lt;/p&gt;
&lt;/div&gt;

&lt;!-- Inline container (stays within text flow) --&gt;
&lt;p&gt;My favorite color is &lt;span style="color:blue"&gt;blue&lt;/span&gt;.&lt;/p&gt;</code></pre>
              <ul>
                <li><code>&lt;div&gt;</code> — block-level container, starts on new line</li>
                <li><code>&lt;span&gt;</code> — inline container, stays within the text</li>
                <li>Neither has semantic meaning — they're just for grouping/styling</li>
              </ul>
            `,
            codeSnippets: [
              {
                title: 'Text Formatting Examples',
                language: 'html',
                code: `<strong>Important Notice</strong>\n<em>Emphasized point</em>\n<p>H<sub>2</sub>O is water. E=mc<sup>2</sup> is Einstein's equation.</p>\n<blockquote cite="https://example.com"><p>"The best way to predict the future is to create it."</p></blockquote>`,
                explanation: 'Examples of semantic formatting, formulas, and blockquotes.'
              }
            ],
            callouts: [
              { type: 'tip', title: 'SEO Best Practice', content: 'Never skip heading levels (e.g. h1 to h4 directly) and maintain a clean hierarchical structure.' }
            ],
            hasQuiz: true,
            quiz: {
              title: 'Module 2 Checkpoint Quiz (5 Questions)',
              passingPercentage: 70,
              questions: [
                {
                  questionText: 'Q1. How many <h1> tags should appear on a single webpage?',
                  type: 'mcq',
                  options: ['A) As many as needed', 'B) Maximum 3', 'C) Only one', 'D) Only two'],
                  correctAnswers: ['C) Only one'],
                  explanation: 'Google and SEO guidelines recommend exactly one <h1> per page.'
                },
                {
                  questionText: 'Q2. Which tag is used for semantic importance (not just visual bold)?',
                  type: 'mcq',
                  options: ['A) <b>', 'B) <strong>', 'C) <bold>', 'D) <heavy>'],
                  correctAnswers: ['B) <strong>'],
                  explanation: '<strong> indicates strong semantic importance for screen readers, unlike <b>.'
                },
                {
                  questionText: 'Q3. What does the <pre> tag do?',
                  type: 'mcq',
                  options: ['A) Adds a preview section', 'B) Makes text bold', 'C) Preserves whitespace and line breaks as written', 'D) Creates a preloader'],
                  correctAnswers: ['C) Preserves whitespace and line breaks as written'],
                  explanation: '<pre> displays text in monospace font preserving exact spaces.'
                },
                {
                  questionText: 'Q4. What is the difference between <div> and <span>?',
                  type: 'mcq',
                  options: ['A) <div> is for images, <span> is for text', 'B) <div> is block-level, <span> is inline', 'C) <div> is inline, <span> is block-level', 'D) They are identical'],
                  correctAnswers: ['B) <div> is block-level, <span> is inline'],
                  explanation: '<div> takes full container width (block), <span> stays within line text flow (inline).'
                },
                {
                  questionText: 'Q5. Which tag represents text that has been deleted (strikethrough with semantic meaning)?',
                  type: 'mcq',
                  options: ['A) <s>', 'B) <strike>', 'C) <del>', 'D) <remove>'],
                  correctAnswers: ['C) <del>'],
                  explanation: '<del> represents deleted text in HTML5.'
                }
              ]
            }
          }
        ]
      },
      {
        order: 3,
        title: 'Links & Navigation Architecture',
        description: 'Understand hyperlinks, absolute vs relative paths, target="_blank" security, mailto/tel links, bookmark anchors, and download attributes.',
        estimatedTimeMinutes: 25,
        lessons: [
          {
            title: 'Hyperlinks & Navigation Anchors',
            order: 1,
            estimatedTimeMinutes: 25,
            contentHtml: `
              <h3>3.1 The Anchor Tag — &lt;a&gt;</h3>
              <p>The <code>&lt;a&gt;</code> (anchor) tag creates hyperlinks:</p>
              <pre><code>&lt;a href="https://www.google.com"&gt;Visit Google&lt;/a&gt;</code></pre>

              <p><strong>Parts:</strong></p>
              <ul>
                <li><code>href</code> — "HyperText REFerence" — the destination URL</li>
                <li><code>Link text</code> — what the user clicks on</li>
              </ul>

              <hr />

              <h3>3.2 Absolute vs Relative Paths</h3>
              <h4>Absolute URLs — full address including protocol:</h4>
              <pre><code>&lt;a href="https://www.example.com/about.html"&gt;About Us&lt;/a&gt;
&lt;a href="https://www.youtube.com"&gt;YouTube&lt;/a&gt;</code></pre>

              <h4>Relative URLs — relative to the current file's location:</h4>
              <pre><code>&lt;!-- Same folder --&gt;
&lt;a href="about.html"&gt;About&lt;/a&gt;

&lt;!-- Subfolder --&gt;
&lt;a href="pages/contact.html"&gt;Contact&lt;/a&gt;

&lt;!-- Go up one folder --&gt;
&lt;a href="../index.html"&gt;Home&lt;/a&gt;

&lt;!-- Root of site --&gt;
&lt;a href="/index.html"&gt;Home&lt;/a&gt;</code></pre>

              <hr />

              <h3>3.3 The target Attribute</h3>
              <pre><code>&lt;!-- Open in same tab (default) --&gt;
&lt;a href="about.html" target="_self"&gt;About&lt;/a&gt;

&lt;!-- Open in new tab --&gt;
&lt;a href="https://google.com" target="_blank" rel="noopener noreferrer"&gt;Google&lt;/a&gt;

&lt;!-- Open in parent frame --&gt;
&lt;a href="page.html" target="_parent"&gt;Parent&lt;/a&gt;</code></pre>

              <p><strong>Security Note:</strong> Always add <code>rel="noopener noreferrer"</code> when using <code>target="_blank"</code> to prevent security vulnerabilities.</p>

              <hr />

              <h3>3.4 Email and Phone Links</h3>
              <pre><code>&lt;!-- Email link (opens default mail app) --&gt;
&lt;a href="mailto:pankaj@example.com"&gt;Send Email&lt;/a&gt;

&lt;!-- Email with subject and body pre-filled --&gt;
&lt;a href="mailto:info@site.com?subject=Hello&amp;body=I%20want%20to%20enroll"&gt;Contact Us&lt;/a&gt;

&lt;!-- Phone link (clickable on mobile) --&gt;
&lt;a href="tel:+9779800000000"&gt;Call Us: +977-980-000-0000&lt;/a&gt;</code></pre>

              <hr />

              <h3>3.5 Bookmark Links (Jump to Section)</h3>
              <pre><code>&lt;!-- Create a bookmark target using id --&gt;
&lt;h2 id="courses"&gt;Our Courses&lt;/h2&gt;
&lt;h2 id="contact"&gt;Contact Us&lt;/h2&gt;

&lt;!-- Link to the bookmark --&gt;
&lt;a href="#courses"&gt;Jump to Courses&lt;/a&gt;
&lt;a href="#contact"&gt;Jump to Contact&lt;/a&gt;

&lt;!-- Link to bookmark on another page --&gt;
&lt;a href="about.html#team"&gt;Meet the Team&lt;/a&gt;</code></pre>

              <hr />

              <h3>3.6 Navigation Menu Structure</h3>
              <pre><code>&lt;nav&gt;
  &lt;ul&gt;
    &lt;li&gt;&lt;a href="index.html"&gt;Home&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="about.html"&gt;About&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="courses.html"&gt;Courses&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="contact.html"&gt;Contact&lt;/a&gt;&lt;/li&gt;
  &lt;/ul&gt;
&lt;/nav&gt;</code></pre>

              <hr />

              <h3>3.7 Download Links</h3>
              <pre><code>&lt;!-- Link to download a file --&gt;
&lt;a href="files/resume.pdf" download&gt;Download My Resume&lt;/a&gt;

&lt;!-- Download with a custom filename --&gt;
&lt;a href="files/resume.pdf" download="Pankaj-Resume.pdf"&gt;Download Resume&lt;/a&gt;</code></pre>
            `,
            codeSnippets: [
              {
                title: 'Anchor Tag Variations',
                language: 'html',
                code: `<!-- Open in new tab safely -->\n<a href="https://google.com" target="_blank" rel="noopener noreferrer">Google</a>\n\n<!-- Jump to section on same page -->\n<a href="#courses">Jump to Courses</a>\n\n<!-- Download file -->\n<a href="files/resume.pdf" download="Pankaj-Resume.pdf">Download Resume</a>`,
                explanation: 'Demonstrates secure target="_blank", bookmark links, and download attribute.'
              }
            ],
            callouts: [
              { type: 'warning', title: 'Security Alert', content: 'Target="_blank" without rel="noopener noreferrer" allows destination pages to access window.opener.' }
            ],
            hasQuiz: true,
            quiz: {
              title: 'Module 3 Checkpoint Quiz (5 Questions)',
              passingPercentage: 70,
              questions: [
                {
                  questionText: 'Q1. What does href stand for in an anchor tag?',
                  type: 'mcq',
                  options: ['A) HyperText Reference File', 'B) HyperText REFerence', 'C) HyperText Render Format', 'D) HyperText Reading Format'],
                  correctAnswers: ['B) HyperText REFerence'],
                  explanation: 'href stands for HyperText REFerence.'
                },
                {
                  questionText: 'Q2. Which attribute opens a link in a new browser tab?',
                  type: 'mcq',
                  options: ['A) target="_new"', 'B) target="_tab"', 'C) target="_blank"', 'D) open="new"'],
                  correctAnswers: ['C) target="_blank"'],
                  explanation: 'target="_blank" instructs the browser to open the link in a new tab.'
                },
                {
                  questionText: 'Q3. What type of URL is ../pages/about.html?',
                  type: 'mcq',
                  options: ['A) Absolute URL', 'B) Relative URL', 'C) Bookmark URL', 'D) Protocol URL'],
                  correctAnswers: ['B) Relative URL'],
                  explanation: 'Paths referencing relative directories using ../ are relative URLs.'
                },
                {
                  questionText: 'Q4. How do you create a clickable phone link?',
                  type: 'mcq',
                  options: ['A) <a href="phone:+977...">Call</a>', 'B) <a href="call:+977...">Call</a>', 'C) <a href="tel:+977...">Call</a>', 'D) <a href="mobile:+977...">Call</a>'],
                  correctAnswers: ['C) <a href="tel:+977...">Call</a>'],
                  explanation: 'The tel: scheme initiates phone calls on mobile devices.'
                },
                {
                  questionText: 'Q5. What security attribute should be added when using target="_blank"?',
                  type: 'mcq',
                  options: ['A) rel="nofollow"', 'B) rel="noopener noreferrer"', 'C) rel="safe"', 'D) secure="true"'],
                  correctAnswers: ['B) rel="noopener noreferrer"'],
                  explanation: 'rel="noopener noreferrer" protects against window.opener security threats.'
                }
              ]
            }
          }
        ]
      },
      {
        order: 4,
        title: 'Images & Multimedia Integration',
        description: 'Learn responsive image optimization, alt text rules, figures, SVGs, HTML5 audio, video, and iframe embeds.',
        estimatedTimeMinutes: 30,
        lessons: [
          {
            title: 'Images, Audio, Video & iFrames',
            order: 1,
            estimatedTimeMinutes: 30,
            contentHtml: `
              <h3>4.1 The &lt;img&gt; Tag</h3>
              <pre><code>&lt;img src="photo.jpg" alt="A mountain landscape" width="600" height="400" /&gt;</code></pre>

              <h4>Key Attributes:</h4>
              <table border="1" style="width:100%; border-collapse:collapse; margin-bottom:1rem; text-align:left;">
                <thead>
                  <tr style="background:#F8FAFC;">
                    <th style="padding:10px; border:1px solid #CBD5E1;">Attribute</th>
                    <th style="padding:10px; border:1px solid #CBD5E1;">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style="padding:8px; border:1px solid #E2E8F0;"><code>src</code></td><td style="padding:8px; border:1px solid #E2E8F0;">Source — path to the image file</td></tr>
                  <tr><td style="padding:8px; border:1px solid #E2E8F0;"><code>alt</code></td><td style="padding:8px; border:1px solid #E2E8F0;">Alternative text (accessibility &amp; SEO)</td></tr>
                  <tr><td style="padding:8px; border:1px solid #E2E8F0;"><code>width / height</code></td><td style="padding:8px; border:1px solid #E2E8F0;">Dimensions in pixels</td></tr>
                  <tr><td style="padding:8px; border:1px solid #E2E8F0;"><code>loading="lazy"</code></td><td style="padding:8px; border:1px solid #E2E8F0;">Defers loading until image is in viewport</td></tr>
                  <tr><td style="padding:8px; border:1px solid #E2E8F0;"><code>title</code></td><td style="padding:8px; border:1px solid #E2E8F0;">Tooltip text on hover</td></tr>
                </tbody>
              </table>

              <h4>Image Formats:</h4>
              <ul>
                <li><strong>JPEG/JPG</strong> — Photos, complex images (lossy compression)</li>
                <li><strong>PNG</strong> — Images needing transparency</li>
                <li><strong>GIF</strong> — Simple animations</li>
                <li><strong>SVG</strong> — Vector graphics (infinitely scalable)</li>
                <li><strong>WebP</strong> — Modern format, best compression + quality</li>
              </ul>

              <hr />

              <h3>4.2 The alt Attribute — Critical for Accessibility</h3>
              <pre><code>&lt;!-- Good alt text: descriptive --&gt;
&lt;img src="dog.jpg" alt="A golden retriever puppy playing in a park" /&gt;

&lt;!-- Decorative image: empty alt (screen reader skips it) --&gt;
&lt;img src="decorative-border.png" alt="" /&gt;

&lt;!-- Bad: missing alt (accessibility failure) --&gt;
&lt;img src="dog.jpg" /&gt;</code></pre>

              <hr />

              <h3>4.3 Figure and Figcaption</h3>
              <pre><code>&lt;figure&gt;
  &lt;img src="html-logo.png" alt="HTML5 logo" /&gt;
  &lt;figcaption&gt;The official HTML5 logo, adopted in 2011&lt;/figcaption&gt;
&lt;/figure&gt;</code></pre>
              <p><code>&lt;figure&gt;</code> groups media with its caption. <code>&lt;figcaption&gt;</code> provides a visible caption.</p>

              <hr />

              <h3>4.4 SVG Inline</h3>
              <pre><code>&lt;!-- Simple inline SVG circle --&gt;
&lt;svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"&gt;
  &lt;circle cx="50" cy="50" r="40" fill="blue" /&gt;
&lt;/svg&gt;

&lt;!-- SVG as image file --&gt;
&lt;img src="logo.svg" alt="Company Logo" /&gt;</code></pre>
              <p><strong>SVG</strong> = Scalable Vector Graphics — perfect for logos, icons, illustrations.</p>

              <hr />

              <h3>4.5 HTML5 Audio — &lt;audio&gt;</h3>
              <pre><code>&lt;audio controls&gt;
  &lt;source src="music.mp3" type="audio/mpeg" /&gt;
  &lt;source src="music.ogg" type="audio/ogg" /&gt;
  Your browser does not support the audio element.
&lt;/audio&gt;</code></pre>

              <h4>Attributes:</h4>
              <ul>
                <li><code>controls</code> — Shows play/pause/volume controls</li>
                <li><code>autoplay</code> — Starts playing automatically (use sparingly)</li>
                <li><code>loop</code> — Loops the audio</li>
                <li><code>muted</code> — Starts muted</li>
              </ul>

              <hr />

              <h3>4.6 HTML5 Video — &lt;video&gt;</h3>
              <pre><code>&lt;video width="640" height="360" controls poster="thumbnail.jpg"&gt;
  &lt;source src="intro.mp4" type="video/mp4" /&gt;
  &lt;source src="intro.webm" type="video/webm" /&gt;
  Your browser does not support the video element.
&lt;/video&gt;</code></pre>

              <h4>Attributes:</h4>
              <ul>
                <li><code>controls</code> — Shows video controls</li>
                <li><code>poster</code> — Thumbnail image shown before play</li>
                <li><code>autoplay muted</code> — Auto-plays silently (browsers allow this combination)</li>
                <li><code>loop</code> — Loops the video</li>
                <li><code>preload="none|metadata|auto"</code> — Controls how much to preload</li>
              </ul>

              <hr />

              <h3>4.7 iFrames — Embedding External Content</h3>
              <pre><code>&lt;!-- Embed a YouTube video --&gt;
&lt;iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="YouTube video player"
  allowfullscreen
  frameborder="0"&gt;
&lt;/iframe&gt;

&lt;!-- Embed Google Maps --&gt;
&lt;iframe
  src="https://www.google.com/maps/embed?pb=..."
  width="600"
  height="450"
  allowfullscreen
  loading="lazy"&gt;
&lt;/iframe&gt;</code></pre>
            `,
            codeSnippets: [
              {
                title: 'Responsive Video & iFrame',
                language: 'html',
                code: `<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" title="YouTube video player" allowfullscreen frameborder="0"></iframe>`,
                explanation: 'Standard responsive YouTube iframe embed snippet.'
              }
            ],
            callouts: [
              { type: 'tip', title: 'Image Loading Strategy', content: 'Use loading="lazy" on images below the fold to defer loading until scrolled into view.' }
            ],
            hasQuiz: true,
            quiz: {
              title: 'Module 4 Checkpoint Quiz (5 Questions)',
              passingPercentage: 70,
              questions: [
                {
                  questionText: 'Q1. Which attribute provides alternative text for an image?',
                  type: 'mcq',
                  options: ['A) title', 'B) description', 'C) alt', 'D) caption'],
                  correctAnswers: ['C) alt'],
                  explanation: 'The alt attribute provides alternative text for accessibility and broken images.'
                },
                {
                  questionText: 'Q2. Which image format supports transparency?',
                  type: 'mcq',
                  options: ['A) JPEG', 'B) PNG', 'C) GIF', 'D) BMP'],
                  correctAnswers: ['B) PNG'],
                  explanation: 'PNG format supports full alpha channel transparency.'
                },
                {
                  questionText: 'Q3. What does the controls attribute do in <video> and <audio> tags?',
                  type: 'mcq',
                  options: ['A) Sets volume automatically', 'B) Shows the browser\'s built-in media player controls', 'C) Controls the frame rate', 'D) Enables autoplay'],
                  correctAnswers: ['B) Shows the browser\'s built-in media player controls'],
                  explanation: 'controls displays play, pause, volume, and progress sliders.'
                },
                {
                  questionText: 'Q4. Which tag is used to embed external content like YouTube videos?',
                  type: 'mcq',
                  options: ['A) <embed>', 'B) <object>', 'C) <frame>', 'D) <iframe>'],
                  correctAnswers: ['D) <iframe>'],
                  explanation: '<iframe> embeds external HTML documents or web applications.'
                },
                {
                  questionText: 'Q5. What does the poster attribute in <video> do?',
                  type: 'mcq',
                  options: ['A) Adds a watermark', 'B) Shows a thumbnail image before the video plays', 'C) Sets the video title', 'D) Adds captions'],
                  correctAnswers: ['B) Shows a thumbnail image before the video plays'],
                  explanation: 'poster sets a preview thumbnail image displayed before playback.'
                }
              ]
            }
          }
        ]
      },
      {
        order: 5,
        title: 'Lists (Unordered, Ordered & Description Lists)',
        description: 'Construct bulleted, numbered, description glossaries, nested lists, and semantic navigation systems.',
        estimatedTimeMinutes: 20,
        lessons: [
          {
            title: 'List Types & Nested Lists',
            order: 1,
            estimatedTimeMinutes: 20,
            contentHtml: `
              <h3>5.1 Unordered Lists — &lt;ul&gt;</h3>
              <p>Used for items with no particular order:</p>
              <pre><code>&lt;ul&gt;
  &lt;li&gt;HTML&lt;/li&gt;
  &lt;li&gt;CSS&lt;/li&gt;
  &lt;li&gt;JavaScript&lt;/li&gt;
&lt;/ul&gt;</code></pre>

              <p>Default display: bullet points (•)</p>

              <pre><code>&lt;!-- Change bullet style with CSS --&gt;
&lt;ul style="list-style-type: square;"&gt;
  &lt;li&gt;Square bullets&lt;/li&gt;
&lt;/ul&gt;

&lt;ul style="list-style-type: none;"&gt;
  &lt;li&gt;No bullets (common for navigation)&lt;/li&gt;
&lt;/ul&gt;</code></pre>

              <hr />

              <h3>5.2 Ordered Lists — &lt;ol&gt;</h3>
              <p>Used for items in a specific sequence:</p>
              <pre><code>&lt;ol&gt;
  &lt;li&gt;Learn HTML&lt;/li&gt;
  &lt;li&gt;Learn CSS&lt;/li&gt;
  &lt;li&gt;Learn JavaScript&lt;/li&gt;
  &lt;li&gt;Build projects&lt;/li&gt;
&lt;/ol&gt;</code></pre>

              <h4>Attributes for &lt;ol&gt;:</h4>
              <pre><code>&lt;!-- Start from number 5 --&gt;
&lt;ol start="5"&gt;
  &lt;li&gt;Fifth item&lt;/li&gt;
  &lt;li&gt;Sixth item&lt;/li&gt;
&lt;/ol&gt;

&lt;!-- Reverse order --&gt;
&lt;ol reversed&gt;
  &lt;li&gt;Last step&lt;/li&gt;
  &lt;li&gt;Second-to-last&lt;/li&gt;
&lt;/ol&gt;

&lt;!-- Use letters --&gt;
&lt;ol type="A"&gt;
  &lt;li&gt;Option A&lt;/li&gt;
  &lt;li&gt;Option B&lt;/li&gt;
&lt;/ol&gt;

&lt;!-- Use Roman numerals --&gt;
&lt;ol type="I"&gt;
  &lt;li&gt;Introduction&lt;/li&gt;
  &lt;li&gt;Methods&lt;/li&gt;
&lt;/ol&gt;</code></pre>

              <hr />

              <h3>5.3 Description Lists — &lt;dl&gt;</h3>
              <p>Used for term-definition pairs (like a glossary):</p>
              <pre><code>&lt;dl&gt;
  &lt;dt&gt;HTML&lt;/dt&gt;
  &lt;dd&gt;HyperText Markup Language — used to structure webpages&lt;/dd&gt;

  &lt;dt&gt;CSS&lt;/dt&gt;
  &lt;dd&gt;Cascading Style Sheets — used to style webpages&lt;/dd&gt;

  &lt;dt&gt;JavaScript&lt;/dt&gt;
  &lt;dd&gt;A programming language that makes webpages interactive&lt;/dd&gt;
&lt;/dl&gt;</code></pre>
              <ul>
                <li><code>&lt;dl&gt;</code> — Description List container</li>
                <li><code>&lt;dt&gt;</code> — Description Term (the word/term)</li>
                <li><code>&lt;dd&gt;</code> — Description Detail (the definition/explanation)</li>
              </ul>

              <hr />

              <h3>5.4 Nested Lists</h3>
              <p>Lists can be placed inside list items:</p>
              <pre><code>&lt;ul&gt;
  &lt;li&gt;Frontend Technologies
    &lt;ul&gt;
      &lt;li&gt;HTML&lt;/li&gt;
      &lt;li&gt;CSS
        &lt;ul&gt;
          &lt;li&gt;Flexbox&lt;/li&gt;
          &lt;li&gt;Grid&lt;/li&gt;
        &lt;/ul&gt;
      &lt;/li&gt;
      &lt;li&gt;JavaScript&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/li&gt;
  &lt;li&gt;Backend Technologies
    &lt;ol&gt;
      &lt;li&gt;Node.js&lt;/li&gt;
      &lt;li&gt;Python&lt;/li&gt;
      &lt;li&gt;PHP&lt;/li&gt;
    &lt;/ol&gt;
  &lt;/li&gt;
&lt;/ul&gt;</code></pre>

              <hr />

              <h3>5.5 Navigation Using Lists</h3>
              <p>Lists are commonly used for navigation menus:</p>
              <pre><code>&lt;nav&gt;
  &lt;ul&gt;
    &lt;li&gt;&lt;a href="#home"&gt;Home&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="#about"&gt;About&lt;/a&gt;
      &lt;ul&gt;
        &lt;li&gt;&lt;a href="#team"&gt;Team&lt;/a&gt;&lt;/li&gt;
        &lt;li&gt;&lt;a href="#history"&gt;History&lt;/a&gt;&lt;/li&gt;
      &lt;/ul&gt;
    &lt;/li&gt;
    &lt;li&gt;&lt;a href="#contact"&gt;Contact&lt;/a&gt;&lt;/li&gt;
  &lt;/ul&gt;
&lt;/nav&gt;</code></pre>
            `,
            codeSnippets: [
              {
                title: 'Nested Navigation List',
                language: 'html',
                code: `<nav>\n  <ul>\n    <li><a href="#home">Home</a></li>\n    <li><a href="#about">About</a>\n      <ul>\n        <li><a href="#team">Team</a></li>\n        <li><a href="#history">History</a></li>\n      </ul>\n    </li>\n  </ul>\n</nav>`,
                explanation: 'Standard multi-level navigation menu created with nested <ul>.'
              }
            ],
            callouts: [
              { type: 'info', title: 'Description Lists', content: '<dl> contains terms <dt> followed by definitions <dd>.' }
            ],
            hasQuiz: true,
            quiz: {
              title: 'Module 5 Checkpoint Quiz (5 Questions)',
              passingPercentage: 70,
              questions: [
                {
                  questionText: 'Q1. Which tag creates an unordered (bulleted) list?',
                  type: 'mcq',
                  options: ['A) <ol>', 'B) <list>', 'C) <ul>', 'D) <li>'],
                  correctAnswers: ['C) <ul>'],
                  explanation: '<ul> creates an unordered list.'
                },
                {
                  questionText: 'Q2. How do you make an ordered list start from number 5?',
                  type: 'mcq',
                  options: ['A) <ol begin="5">', 'B) <ol start="5">', 'C) <ol from="5">', 'D) <ol number="5">'],
                  correctAnswers: ['B) <ol start="5">'],
                  explanation: 'The start attribute sets the starting integer for ordered lists.'
                },
                {
                  questionText: 'Q3. What are the three tags used in a Description List?',
                  type: 'mcq',
                  options: ['A) <dl>, <di>, <dd>', 'B) <dl>, <dt>, <dd>', 'C) <list>, <term>, <def>', 'D) <dl>, <dt>, <def>'],
                  correctAnswers: ['B) <dl>, <dt>, <dd>'],
                  explanation: '<dl> is container, <dt> is term, <dd> is description definition.'
                },
                {
                  questionText: 'Q4. Which <ol> type attribute value shows Roman numerals?',
                  type: 'mcq',
                  options: ['A) type="R"', 'B) type="roman"', 'C) type="I"', 'D) type="num"'],
                  correctAnswers: ['C) type="I"'],
                  explanation: 'type="I" displays uppercase Roman numerals.'
                },
                {
                  questionText: 'Q5. Can a <ul> list be placed inside an <ol> list item?',
                  type: 'mcq',
                  options: ['A) No, lists cannot be nested', 'B) Yes, but only two levels deep', 'C) Yes, lists can be nested inside each other', 'D) Only <ol> can be nested inside <ul>'],
                  correctAnswers: ['C) Yes, lists can be nested inside each other'],
                  explanation: 'Any list can be nested inside the <li> tag of another list.'
                }
              ]
            }
          }
        ]
      },
      {
        order: 6,
        title: 'Tables & Complex Tabular Data',
        description: 'Build structured data tables with headers, body, footer, caption, rowspan, colspan, and scope accessibility.',
        estimatedTimeMinutes: 25,
        lessons: [
          {
            title: 'Building Data Tables with Rowspan & Colspan',
            order: 1,
            estimatedTimeMinutes: 25,
            contentHtml: `
              <h3>6.1 Basic Table Structure</h3>
              <pre><code>&lt;table border="1"&gt;
  &lt;caption&gt;Student Score Card&lt;/caption&gt;
  &lt;thead&gt;
    &lt;tr&gt;&lt;th scope="col"&gt;Name&lt;/th&gt;&lt;th scope="col"&gt;Score&lt;/th&gt;&lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody&gt;
    &lt;tr&gt;&lt;td&gt;Pankaj&lt;/td&gt;&lt;td&gt;95&lt;/td&gt;&lt;/tr&gt;
  &lt;/tbody&gt;
  &lt;tfoot&gt;
    &lt;tr&gt;&lt;td colspan="2"&gt;Average Score: 95&lt;/td&gt;&lt;/tr&gt;
  &lt;/tfoot&gt;
&lt;/table&gt;</code></pre>

              <h3>6.2 Colspan and Rowspan</h3>
              <ul>
                <li><code>colspan="N"</code>: Spans a table cell horizontally across N columns.</li>
                <li><code>rowspan="N"</code>: Spans a table cell vertically across N rows.</li>
                <li><code>scope="col"</code> / <code>scope="row"</code>: Informs screen readers of header direction.</li>
              </ul>
            `,
            codeSnippets: [
              {
                title: 'Rowspan Timetable Example',
                language: 'html',
                code: `<table>\n  <tr><th>Day</th><th>Time</th><th>Subject</th></tr>\n  <tr>\n    <td rowspan="2">Monday</td>\n    <td>9:00 AM</td>\n    <td>HTML5</td>\n  </tr>\n  <tr>\n    <td>11:00 AM</td>\n    <td>CSS3</td>\n  </tr>\n</table>`,
                explanation: 'Cell Monday spans 2 consecutive rows.'
              }
            ],
            callouts: [
              { type: 'tip', title: 'Table Accessibility', content: 'Always include <caption> and <th scope="col"> for screen reader compatibility.' }
            ],
            hasQuiz: true,
            quiz: {
              title: 'Module 6 Checkpoint Quiz',
              passingPercentage: 70,
              questions: [
                {
                  questionText: 'Which tag defines a table header cell?',
                  type: 'mcq',
                  options: ['<td>', '<th>', '<thead>', '<header>'],
                  correctAnswers: ['<th>'],
                  explanation: '<th> defines a table header cell (bold and centered by default).'
                },
                {
                  questionText: 'What does colspan="3" do?',
                  type: 'mcq',
                  options: ['Adds 3 rows to a cell', 'Makes a cell span across 3 columns', 'Limits a cell to 3 characters', 'Creates 3 new cells'],
                  correctAnswers: ['Makes a cell span across 3 columns'],
                  explanation: 'colspan merges table cells horizontally across columns.'
                },
                {
                  questionText: 'Which section of a table should contain totals or summary rows?',
                  type: 'mcq',
                  options: ['<thead>', '<tbody>', '<tfoot>', '<tsummary>'],
                  correctAnswers: ['<tfoot>'],
                  explanation: '<tfoot> defines summary or total calculation rows at the table bottom.'
                },
                {
                  questionText: 'What tag adds a title/description to a table?',
                  type: 'mcq',
                  options: ['<title>', '<label>', '<caption>', '<summary>'],
                  correctAnswers: ['<caption>'],
                  explanation: '<caption> provides an accessible title for a <table>.'
                },
                {
                  questionText: 'What is rowspan="2" used for?',
                  type: 'mcq',
                  options: ['Making text span 2 lines', 'Making a cell span across 2 rows', 'Adding 2 new rows', 'Merging 2 tables'],
                  correctAnswers: ['Making a cell span across 2 rows'],
                  explanation: 'rowspan merges cells vertically across multiple rows.'
                }
              ]
            }
          }
        ]
      },
      {
        order: 7,
        title: 'Interactive HTML5 Forms & Controls',
        description: 'Design robust forms using text inputs, radio, checkboxes, select dropdowns, labels, fieldsets, and native HTML5 validation.',
        estimatedTimeMinutes: 30,
        lessons: [
          {
            title: 'User Input Forms & Native Validation',
            order: 1,
            estimatedTimeMinutes: 30,
            contentHtml: `
              <h3>7.1 The Form Element &amp; Inputs</h3>
              <p>Forms send data via GET or POST methods.</p>
              <pre><code>&lt;form action="/submit" method="POST"&gt;
  &lt;label for="email"&gt;Email Address:&lt;/label&gt;
  &lt;input type="email" id="email" name="email" required /&gt;

  &lt;fieldset&gt;
    &lt;legend&gt;Select Level:&lt;/legend&gt;
    &lt;input type="radio" id="b" name="lvl" value="b" checked /&gt;
    &lt;label for="b"&gt;Beginner&lt;/label&gt;
  &lt;/fieldset&gt;

  &lt;button type="submit"&gt;Submit Form&lt;/button&gt;
  &lt;!-- form controls go here --&gt;
&lt;/form&gt;</code></pre>
              <p><strong>Key Attributes:</strong></p>
              <ul>
                <li><code>action</code> — URL where form data is sent</li>
                <li><code>method</code> — GET (data in URL) or POST (data in request body)</li>
              </ul>

              <hr />

              <h3>7.2 Text Input Fields</h3>
              <pre><code>&lt;!-- Text input --&gt;
&lt;label for="name"&gt;Full Name:&lt;/label&gt;
&lt;input type="text" id="name" name="name" placeholder="Enter your name" required /&gt;

&lt;!-- Email input (validates email format) --&gt;
&lt;label for="email"&gt;Email:&lt;/label&gt;
&lt;input type="email" id="email" name="email" required /&gt;

&lt;!-- Password input (hides characters) --&gt;
&lt;label for="password"&gt;Password:&lt;/label&gt;
&lt;input type="password" id="password" name="password" minlength="8" required /&gt;

&lt;!-- Number input --&gt;
&lt;input type="number" name="age" min="1" max="120" /&gt;

&lt;!-- Phone number --&gt;
&lt;input type="tel" name="phone" pattern="[0-9]{10}" /&gt;

&lt;!-- URL input --&gt;
&lt;input type="url" name="website" placeholder="https://example.com" /&gt;

&lt;!-- Search box --&gt;
&lt;input type="search" name="q" placeholder="Search..." /&gt;</code></pre>

              <hr />

              <h3>7.3 Labels — Critical for Accessibility</h3>
              <pre><code>&lt;!-- Method 1: Using 'for' and 'id' (recommended) --&gt;
&lt;label for="username"&gt;Username:&lt;/label&gt;
&lt;input type="text" id="username" name="username" /&gt;

&lt;!-- Method 2: Wrapping input inside label --&gt;
&lt;label&gt;
  Email:
  &lt;input type="email" name="email" /&gt;
&lt;/label&gt;</code></pre>
              <p>Always pair <code>&lt;label&gt;</code> with input fields — this is required for accessibility.</p>

              <hr />

              <h3>7.4 Textarea — Multi-line Text</h3>
              <pre><code>&lt;label for="message"&gt;Message:&lt;/label&gt;
&lt;textarea id="message" name="message" rows="5" cols="40" placeholder="Write your message here..."&gt;&lt;/textarea&gt;</code></pre>

              <hr />

              <h3>7.5 Radio Buttons</h3>
              <pre><code>&lt;fieldset&gt;
  &lt;legend&gt;Select your level:&lt;/legend&gt;
  
  &lt;input type="radio" id="beginner" name="level" value="beginner" checked /&gt;
  &lt;label for="beginner"&gt;Beginner&lt;/label&gt;

  &lt;input type="radio" id="intermediate" name="level" value="intermediate" /&gt;
  &lt;label for="intermediate"&gt;Intermediate&lt;/label&gt;

  &lt;input type="radio" id="advanced" name="level" value="advanced" /&gt;
  &lt;label for="advanced"&gt;Advanced&lt;/label&gt;
&lt;/fieldset&gt;</code></pre>
              <p>Radio buttons with the same <code>name</code> form a group — only one can be selected.</p>

              <hr />

              <h3>7.6 Checkboxes</h3>
              <pre><code>&lt;fieldset&gt;
  &lt;legend&gt;Select your interests:&lt;/legend&gt;
  
  &lt;input type="checkbox" id="html" name="interest" value="html" checked /&gt;
  &lt;label for="html"&gt;HTML&lt;/label&gt;

  &lt;input type="checkbox" id="css" name="interest" value="css" /&gt;
  &lt;label for="css"&gt;CSS&lt;/label&gt;

  &lt;input type="checkbox" id="js" name="interest" value="js" /&gt;
  &lt;label for="js"&gt;JavaScript&lt;/label&gt;
&lt;/fieldset&gt;</code></pre>

              <hr />

              <h3>7.7 Select Dropdowns</h3>
              <pre><code>&lt;label for="country"&gt;Country:&lt;/label&gt;
&lt;select id="country" name="country"&gt;
  &lt;option value=""&gt;-- Select Country --&lt;/option&gt;
  &lt;optgroup label="South Asia"&gt;
    &lt;option value="np"&gt;Nepal&lt;/option&gt;
    &lt;option value="in"&gt;India&lt;/option&gt;
    &lt;option value="bd"&gt;Bangladesh&lt;/option&gt;
  &lt;/optgroup&gt;
  &lt;optgroup label="Europe"&gt;
    &lt;option value="uk"&gt;United Kingdom&lt;/option&gt;
    &lt;option value="de"&gt;Germany&lt;/option&gt;
  &lt;/optgroup&gt;
&lt;/select&gt;</code></pre>

              <hr />

              <h3>7.8 Other Input Types</h3>
              <pre><code>&lt;!-- Date picker --&gt;
&lt;input type="date" name="birthday" /&gt;

&lt;!-- Color picker --&gt;
&lt;input type="color" name="theme" value="#ff0000" /&gt;

&lt;!-- Range slider --&gt;
&lt;input type="range" name="volume" min="0" max="100" value="50" /&gt;

&lt;!-- File upload --&gt;
&lt;input type="file" name="document" accept=".pdf,.doc" multiple /&gt;

&lt;!-- Hidden field (submitted but not shown) --&gt;
&lt;input type="hidden" name="user_id" value="12345" /&gt;</code></pre>

              <hr />

              <h3>7.9 Form Buttons</h3>
              <pre><code>&lt;!-- Submit button --&gt;
&lt;button type="submit"&gt;Submit Form&lt;/button&gt;

&lt;!-- Reset button (clears form) --&gt;
&lt;button type="reset"&gt;Clear&lt;/button&gt;

&lt;!-- Regular button (for JavaScript) --&gt;
&lt;button type="button" onclick="doSomething()"&gt;Click Me&lt;/button&gt;

&lt;!-- Input submit (older style) --&gt;
&lt;input type="submit" value="Send" /&gt;</code></pre>

              <hr />

              <h3>7.10 Native HTML5 Validation</h3>
              <pre><code>&lt;form&gt;
  &lt;!-- Required field --&gt;
  &lt;input type="text" required /&gt;

  &lt;!-- Minimum/maximum length --&gt;
  &lt;input type="text" minlength="3" maxlength="50" /&gt;

  &lt;!-- Pattern matching (regex) --&gt;
  &lt;input type="text" pattern="[A-Za-z]{3,}" title="Only letters, minimum 3 characters" /&gt;

  &lt;!-- Min/max for numbers --&gt;
  &lt;input type="number" min="18" max="99" /&gt;

  &lt;button type="submit"&gt;Submit&lt;/button&gt;
&lt;/form&gt;</code></pre>
            `,
            codeSnippets: [
              {
                title: 'HTML5 Form with Native Validation',
                language: 'html',
                code: `<form>\n  <label for="usr">Username:</label>\n  <input type="text" id="usr" name="usr" minlength="4" required />\n  <label for="pwd">Password:</label>\n  <input type="password" id="pwd" name="pwd" minlength="8" required />\n  <button type="submit">Register</button>\n</form>`,
                explanation: 'Native client-side validation using minlength and required.'
              }
            ],
            callouts: [
              { type: 'info', title: 'Radio Group Rule', content: 'Radio buttons must share the exact same name attribute to form an exclusive single-choice group.' }
            ],
            hasQuiz: true,
            quiz: {
              title: 'Module 7 Checkpoint Quiz (5 Questions)',
              passingPercentage: 70,
              questions: [
                {
                  questionText: 'Q1. What is the correct way to link a <label> to an <input> field?',
                  type: 'mcq',
                  options: ['A) Use the name attribute on both', 'B) Use for on the label matching the id on the input', 'C) Place the input before the label', 'D) Use the link attribute'],
                  correctAnswers: ['B) Use for on the label matching the id on the input'],
                  explanation: 'Label for="X" connects with input id="X" for accessibility and clickable target expansion.'
                },
                {
                  questionText: 'Q2. How do you make radio buttons in a group exclusive (only one selectable)?',
                  type: 'mcq',
                  options: ['A) Give them the same id', 'B) Give them the same name', 'C) Wrap them in <radiogroup>', 'D) Add exclusive="true"'],
                  correctAnswers: ['B) Give them the same name'],
                  explanation: 'Sharing the name attribute groups radio buttons together.'
                },
                {
                  questionText: 'Q3. Which input type automatically validates email format?',
                  type: 'mcq',
                  options: ['A) type="text"', 'B) type="mail"', 'C) type="email"', 'D) type="address"'],
                  correctAnswers: ['C) type="email"'],
                  explanation: 'type="email" checks for valid email syntax before submission.'
                },
                {
                  questionText: 'Q4. What HTML attribute makes a form field mandatory?',
                  type: 'mcq',
                  options: ['A) mandatory', 'B) validate', 'C) compulsory', 'D) required'],
                  correctAnswers: ['D) required'],
                  explanation: 'The required attribute prevents form submission if empty.'
                },
                {
                  questionText: 'Q5. What does <input type="hidden"> do?',
                  type: 'mcq',
                  options: ['A) Makes input invisible but still submitted', 'B) Encrypts the field value', 'C) Prevents the field from being submitted', 'D) Creates a password field'],
                  correctAnswers: ['A) Makes input invisible but still submitted'],
                  explanation: 'type="hidden" stores hidden state or IDs sent quietly during form submission.'
                }
              ]
            }
          }
        ]
      },
      {
        order: 8,
        title: 'Semantic HTML5 Architecture',
        description: 'Build modern semantic page layouts using header, nav, main, article, section, aside, footer, details, and summary tags.',
        estimatedTimeMinutes: 25,
        lessons: [
          {
            title: 'Semantic Tags & Page Layout',
            order: 1,
            estimatedTimeMinutes: 25,
            contentHtml: `
              <h3>8.1 What is Semantic HTML?</h3>
              <p>Semantic HTML means using tags that convey meaning about the content they contain — not just how it looks.</p>

              <h4>Non-semantic (bad):</h4>
              <pre><code>&lt;div id="header"&gt;...&lt;/div&gt;
&lt;div id="nav"&gt;...&lt;/div&gt;
&lt;div class="main-content"&gt;...&lt;/div&gt;
&lt;div id="footer"&gt;...&lt;/div&gt;</code></pre>

              <h4>Semantic (good):</h4>
              <pre><code>&lt;header&gt;...&lt;/header&gt;
&lt;nav&gt;...&lt;/nav&gt;
&lt;main&gt;...&lt;/main&gt;
&lt;footer&gt;...&lt;/footer&gt;</code></pre>

              <h3>8.2 Native Accordion &amp; Contact</h3>
              <ul>
                <li><code>&lt;details&gt;</code> and <code>&lt;summary&gt;</code>: Creates zero-JS native collapsible accordions.</li>
                <li><code>&lt;address&gt;</code>: Represents physical or email contact details.</li>
              </ul>
            `,
            codeSnippets: [
              {
                title: 'Native Accordion Example',
                language: 'html',
                code: `<details>\n  <summary>What is HTML5?</summary>\n  <p>HTML5 is the latest W3C standard for structure and APIs.</p>\n</details>`,
                explanation: 'Native collapsible FAQ element without JavaScript.'
              }
            ],
            callouts: [
              { type: 'tip', title: 'Article vs Section', content: '<article> is independent self-contained content; <section> is a thematic grouping.' }
            ],
            hasQuiz: true,
            quiz: {
              title: 'Module 8 Checkpoint Quiz',
              passingPercentage: 70,
              questions: [
                {
                  questionText: 'Which element should contain the primary content of a webpage?',
                  type: 'mcq',
                  options: ['<content>', '<body>', '<main>', '<section>'],
                  correctAnswers: ['<main>'],
                  explanation: '<main> holds the unique central content of a webpage.'
                },
                {
                  questionText: 'What is the difference between <article> and <section>?',
                  type: 'mcq',
                  options: ['They are identical', '<article> is self-contained content; <section> is a thematic grouping', '<section> is self-contained; <article> is a grouping', '<article> is only for news'],
                  correctAnswers: ['<article> is self-contained content; <section> is a thematic grouping'],
                  explanation: '<article> makes sense independently, <section> groups related thematic content.'
                },
                {
                  questionText: 'Which element creates a native expandable/collapsible section without JavaScript?',
                  type: 'mcq',
                  options: ['<expand>', '<toggle>', '<details>', '<collapse>'],
                  correctAnswers: ['<details>'],
                  explanation: '<details> paired with <summary> forms native accordions.'
                },
                {
                  questionText: 'How many <main> elements should appear on a single page?',
                  type: 'mcq',
                  options: ['As many as needed', 'Only one', 'Two maximum', 'One per section'],
                  correctAnswers: ['Only one'],
                  explanation: 'Each HTML document must have at most one visible <main> tag.'
                },
                {
                  questionText: 'Q5. Which tag is used for navigation menus?',
                  type: 'mcq',
                  options: ['A) <navigation>', 'B) <menu>', 'C) <nav>', 'D) <links>'],
                  correctAnswers: ['C) <nav>'],
                  explanation: '<nav> identifies major site navigation links.'
                }
              ]
            }
          }
        ]
      },
      {
        order: 9,
        title: 'Web Accessibility (A11Y) & ARIA Standards',
        description: 'Understand WCAG 2.1 principles, screen reader alt text, keyboard navigation, skip links, and ARIA roles/states.',
        estimatedTimeMinutes: 25,
        lessons: [
          {
            title: 'Accessible Web Standards & ARIA Roles',
            order: 1,
            estimatedTimeMinutes: 25,
            contentHtml: `
              <h3>9.1 What is Web Accessibility?</h3>
              <p>Web accessibility (A11Y) means ensuring websites can be used by everyone — including people with:</p>
              <ul>
                <li>Visual impairments (use screen readers like NVDA, VoiceOver)</li>
                <li>Motor disabilities (use keyboard only, voice control)</li>
                <li>Hearing impairments</li>
                <li>Cognitive disabilities</li>
              </ul>

              <h4>WCAG 2.1 Four Principles (POUR):</h4>
              <ul>
                <li><strong>Perceivable</strong> — Content can be seen/heard by all</li>
                <li><strong>Operable</strong> — All functions work via keyboard</li>
                <li><strong>Understandable</strong> — Content is clear and consistent</li>
                <li><strong>Robust</strong> — Works with current and future assistive tech</li>
              </ul>

              <hr />

              <h3>9.2 Text Alternatives (Alt Text)</h3>
              <pre><code>&lt;!-- Informative image: describe what it shows --&gt;
&lt;img src="bar-chart.png" alt="Bar chart showing course enrollment growth from 100 in January to 500 in June 2024" /&gt;

&lt;!-- Decorative: empty alt attribute (screen reader skips it) --&gt;
&lt;img src="divider.png" alt="" role="presentation" /&gt;

&lt;!-- Complex image: link to longer description --&gt;
&lt;img src="complex-diagram.png" alt="System architecture diagram — see description below" /&gt;</code></pre>

              <hr />

              <h3>9.3 Keyboard Navigation</h3>
              <p>All interactive elements must be reachable via the Tab key:</p>
              <pre><code>&lt;!-- Natural tab order follows DOM order --&gt;
&lt;button&gt;First&lt;/button&gt;
&lt;button&gt;Second&lt;/button&gt;
&lt;button&gt;Third&lt;/button&gt;

&lt;!-- Custom tab order (use sparingly) --&gt;
&lt;button tabindex="2"&gt;Second&lt;/button&gt;
&lt;button tabindex="1"&gt;First&lt;/button&gt;

&lt;!-- Remove from tab order --&gt;
&lt;div tabindex="-1" id="modal"&gt;Modal content&lt;/div&gt;

&lt;!-- Make a non-interactive element focusable --&gt;
&lt;div tabindex="0" role="button" onclick="activate()"&gt;Custom Button&lt;/div&gt;</code></pre>

              <hr />

              <h3>9.4 ARIA — Accessible Rich Internet Applications</h3>
              <p>ARIA attributes add accessibility information that HTML alone can't provide.</p>
              <h4>ARIA Roles:</h4>
              <pre><code>&lt;!-- Navigation landmark --&gt;
&lt;nav role="navigation" aria-label="Main navigation"&gt;...&lt;/nav&gt;

&lt;!-- Main content landmark --&gt;
&lt;main role="main"&gt;...&lt;/main&gt;

&lt;!-- Banner landmark --&gt;
&lt;header role="banner"&gt;...&lt;/header&gt;

&lt;!-- Content info landmark --&gt;
&lt;footer role="contentinfo"&gt;...&lt;/footer&gt;

&lt;!-- Custom button --&gt;
&lt;div role="button" tabindex="0" aria-pressed="false"&gt;Toggle&lt;/div&gt;

&lt;!-- Alert (announced immediately by screen readers) --&gt;
&lt;div role="alert"&gt;Form submitted successfully!&lt;/div&gt;

&lt;!-- Dialog (modal) --&gt;
&lt;div role="dialog" aria-labelledby="dialog-title" aria-modal="true"&gt;
  &lt;h2 id="dialog-title"&gt;Confirm Action&lt;/h2&gt;
&lt;/div&gt;</code></pre>

              <hr />

              <h3>9.5 ARIA States and Properties</h3>
              <pre><code>&lt;!-- aria-label: provides a label when visible text is not enough --&gt;
&lt;button aria-label="Close dialog"&gt;✕&lt;/button&gt;

&lt;!-- aria-labelledby: points to another element as the label --&gt;
&lt;section aria-labelledby="section-title"&gt;
  &lt;h2 id="section-title"&gt;Our Courses&lt;/h2&gt;
&lt;/section&gt;

&lt;!-- aria-describedby: additional description --&gt;
&lt;input type="password" aria-describedby="pwd-hint" /&gt;
&lt;p id="pwd-hint"&gt;Password must be at least 8 characters.&lt;/p&gt;

&lt;!-- aria-expanded: shows if something is open/closed --&gt;
&lt;button aria-expanded="false" aria-controls="dropdown"&gt;Menu&lt;/button&gt;
&lt;ul id="dropdown" hidden&gt;...&lt;/ul&gt;

&lt;!-- aria-hidden: hides from screen readers --&gt;
&lt;span aria-hidden="true"&gt;🎉&lt;/span&gt; Congratulations!

&lt;!-- aria-required: marks required fields --&gt;
&lt;input type="text" aria-required="true" /&gt;

&lt;!-- aria-live: announces dynamic changes --&gt;
&lt;div aria-live="polite" aria-atomic="true"&gt;
  Loading results...
&lt;/div&gt;</code></pre>

              <hr />

              <h3>9.6 Skip Navigation Link</h3>
              <pre><code>&lt;!-- First element in body — lets keyboard users skip to content --&gt;
&lt;a href="#main-content" class="skip-link"&gt;Skip to main content&lt;/a&gt;

&lt;header&gt;...&lt;/header&gt;

&lt;main id="main-content"&gt;
  &lt;h1&gt;Welcome&lt;/h1&gt;
&lt;/main&gt;</code></pre>
              <pre><code>.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}
.skip-link:focus {
  top: 0;
}</code></pre>

              <hr />

              <h3>9.7 Accessible Forms</h3>
              <pre><code>&lt;form&gt;
  &lt;!-- Always use labels --&gt;
  &lt;label for="email"&gt;Email Address &lt;span aria-hidden="true"&gt;*&lt;/span&gt;&lt;/label&gt;
  &lt;input type="email" id="email" name="email" required aria-required="true" /&gt;

  &lt;!-- Error messages linked to field --&gt;
  &lt;input type="text" id="name" aria-describedby="name-error" aria-invalid="true" /&gt;
  &lt;span id="name-error" role="alert"&gt;Please enter your full name.&lt;/span&gt;

  &lt;!-- Fieldset groups related inputs --&gt;
  &lt;fieldset&gt;
    &lt;legend&gt;Payment Method&lt;/legend&gt;
    &lt;input type="radio" id="card" name="payment" value="card" /&gt;
    &lt;label for="card"&gt;Credit Card&lt;/label&gt;
  &lt;/fieldset&gt;
&lt;/form&gt;</code></pre>
            `,
            codeSnippets: [
              {
                title: 'Accessible Skip Navigation Link',
                language: 'html',
                code: `<a href="#main-content" class="skip-link">Skip to main content</a>\n<header>...</header>\n<main id="main-content"><h1>Welcome</h1></main>`,
                explanation: 'Skip links allow screen reader and keyboard users to skip repetitive nav menus.'
              }
            ],
            callouts: [
              { type: 'warning', title: 'Decorative Images', content: 'Decorative images must use empty alt="" so screen readers skip them silently.' }
            ],
            hasQuiz: true,
            quiz: {
              title: 'Module 9 Checkpoint Quiz (5 Questions)',
              passingPercentage: 70,
              questions: [
                {
                  questionText: 'Q1. What does A11Y stand for?',
                  type: 'mcq',
                  options: ['A) Accessibility', 'B) Algorithm Year 11', 'C) Audio Layer Year', 'D) Automated Layout Year'],
                  correctAnswers: ['A) Accessibility'],
                  explanation: 'A11Y is the numeronym for Accessibility (A + 11 letters + Y).'
                },
                {
                  questionText: 'Q2. What ARIA role announces updates to screen readers immediately?',
                  type: 'mcq',
                  options: ['A) role="live"', 'B) role="alert"', 'C) role="announce"', 'D) role="notice"'],
                  correctAnswers: ['B) role="alert"'],
                  explanation: 'role="alert" triggers immediate live screen-reader announcements.'
                },
                {
                  questionText: 'Q3. What should the alt attribute contain for a decorative image?',
                  type: 'mcq',
                  options: ['A) The filename', 'B) "decorative"', 'C) An empty string alt=""', 'D) The word "image"'],
                  correctAnswers: ['C) An empty string alt=""'],
                  explanation: 'Empty alt="" signals screen readers to skip purely decorative images.'
                },
                {
                  questionText: 'Q4. What is the purpose of tabindex="-1"?',
                  type: 'mcq',
                  options: ['A) Makes element the first in tab order', 'B) Removes element from tab navigation but allows programmatic focus', 'C) Reverses tab order', 'D) Makes element non-interactive'],
                  correctAnswers: ['B) Removes element from tab navigation but allows programmatic focus'],
                  explanation: 'tabindex="-1" removes item from natural tab order while enabling JS focus().'
                },
                {
                  questionText: 'Q5. What does aria-label do?',
                  type: 'mcq',
                  options: ['A) Adds a visible label below an element', 'B) Provides an accessible name for an element not visible on screen', 'C) Labels the entire page', 'D) Replaces the alt attribute'],
                  correctAnswers: ['B) Provides an accessible name for an element not visible on screen'],
                  explanation: 'aria-label provides an invisible accessible name for screen readers.'
                }
              ]
            }
          }
        ]
      },
      {
        order: 10,
        title: 'Search Engine Optimization (SEO) & Meta Tags',
        description: 'Optimize HTML for Google search ranking using head meta tags, Open Graph cards, Twitter cards, Schema.org JSON-LD, and robots.txt.',
        estimatedTimeMinutes: 25,
        lessons: [
          {
            title: 'SEO Head Meta Tags & Social Share Cards',
            order: 1,
            estimatedTimeMinutes: 25,
            contentHtml: `
              <h3>10.1 What is SEO?</h3>
              <p>SEO (Search Engine Optimization) is the practice of optimizing web pages so they rank higher in search engine results (Google, Bing, etc.).</p>
              <h4>HTML's role in SEO:</h4>
              <ul>
                <li>Page title and meta description</li>
                <li>Heading structure (H1, H2, H3)</li>
                <li>Image alt text</li>
                <li>Semantic HTML structure</li>
                <li>Page load speed</li>
                <li>Mobile responsiveness</li>
              </ul>

              <hr />

              <h3>10.2 Essential SEO Meta Tags</h3>
              <pre><code>&lt;head&gt;
  &lt;!-- Page title (most important SEO element) --&gt;
  &lt;title&gt;HTML Mastery Course — Learn HTML5 from Scratch | PiyushDhara&lt;/title&gt;

  &lt;!-- Meta description (shown in search results) --&gt;
  &lt;meta name="description" content="Complete HTML5 course covering semantic web, forms, accessibility, and advanced APIs. 15 modules, 24 hours, beginner to advanced." /&gt;

  &lt;!-- Keywords (less important today, but still used) --&gt;
  &lt;meta name="keywords" content="HTML course, HTML5, web development, beginner HTML, learn HTML" /&gt;

  &lt;!-- Author --&gt;
  &lt;meta name="author" content="Pankaj Baduwal" /&gt;

  &lt;!-- Robots (control indexing) --&gt;
  &lt;meta name="robots" content="index, follow" /&gt;

  &lt;!-- Canonical URL (prevents duplicate content) --&gt;
  &lt;link rel="canonical" href="https://www.example.com/html-course" /&gt;

  &lt;!-- Charset and viewport (always include) --&gt;
  &lt;meta charset="UTF-8" /&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;
&lt;/head&gt;</code></pre>

              <hr />

              <h3>10.3 Open Graph Tags (Social Media Cards)</h3>
              <p>Open Graph tags control how your page appears when shared on Facebook, LinkedIn, WhatsApp:</p>
              <pre><code>&lt;head&gt;
  &lt;!-- Open Graph --&gt;
  &lt;meta property="og:title" content="HTML Mastery Course" /&gt;
  &lt;meta property="og:description" content="Learn HTML5 from beginner to advanced. 15 modules, free for students." /&gt;
  &lt;meta property="og:image" content="https://www.example.com/images/course-thumbnail.jpg" /&gt;
  &lt;meta property="og:url" content="https://www.example.com/html-course" /&gt;
  &lt;meta property="og:type" content="website" /&gt;
  &lt;meta property="og:site_name" content="PiyushDhara" /&gt;
  &lt;meta property="og:locale" content="en_US" /&gt;
&lt;/head&gt;</code></pre>

              <hr />

              <h3>10.4 Twitter Card Tags</h3>
              <pre><code>&lt;!-- Twitter Card --&gt;
&lt;meta name="twitter:card" content="summary_large_image" /&gt;
&lt;meta name="twitter:site" content="@piyushdhara" /&gt;
&lt;meta name="twitter:title" content="HTML Mastery Course" /&gt;
&lt;meta name="twitter:description" content="Complete 15-module HTML5 certification course — free for students!" /&gt;
&lt;meta name="twitter:image" content="https://www.example.com/images/twitter-card.jpg" /&gt;</code></pre>

              <hr />

              <h3>10.5 Structured Data — Schema.org</h3>
              <pre><code>&lt;!-- JSON-LD schema for a course --&gt;
&lt;script type="application/ld+json"&gt;
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "HTML Mastery: Beginner to Advanced",
  "description": "Complete HTML5 certification course with 15 modules",
  "provider": {
    "@type": "Organization",
    "name": "PiyushDhara"
  },
  "instructor": {
    "@type": "Person",
    "name": "Pankaj Baduwal"
  }
}
&lt;/script&gt;</code></pre>

              <hr />

              <h3>10.6 Favicon</h3>
              <pre><code>&lt;!-- Basic favicon --&gt;
&lt;link rel="icon" href="/favicon.ico" /&gt;

&lt;!-- PNG favicon (multiple sizes) --&gt;
&lt;link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" /&gt;
&lt;link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /&gt;

&lt;!-- Apple touch icon --&gt;
&lt;link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" /&gt;

&lt;!-- Web app manifest --&gt;
&lt;link rel="manifest" href="/site.webmanifest" /&gt;</code></pre>

              <hr />

              <h3>10.7 robots.txt</h3>
              <p>The robots.txt file (at the root of the domain) tells search bots what to crawl:</p>
              <pre><code># Allow all bots to crawl everything
User-agent: *
Allow: /

# Block a specific folder from indexing
Disallow: /private/

# Block a specific bot
User-agent: Googlebot
Disallow: /temp/

# Link to sitemap
Sitemap: https://www.example.com/sitemap.xml</code></pre>
            `,
            codeSnippets: [
              {
                title: 'JSON-LD Course Schema',
                language: 'html',
                code: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Course",\n  "name": "HTML Mastery: Beginner to Advanced",\n  "description": "Complete HTML5 certification course",\n  "provider": {\n    "@type": "Organization",\n    "name": "PiyushDhara"\n  }\n}\n</script>`,
                explanation: 'Structured schema markup for search engine course cards.'
              }
            ],
            callouts: [
              { type: 'info', title: 'Canonical URL', content: 'link rel="canonical" tells search engines the preferred URL to prevent duplicate content penalties.' }
            ],
            hasQuiz: true,
            quiz: {
              title: 'Module 10 Checkpoint Quiz (5 Questions)',
              passingPercentage: 70,
              questions: [
                {
                  questionText: 'Q1. Which HTML element has the greatest impact on SEO page ranking?',
                  type: 'mcq',
                  options: ['A) <meta name="keywords">', 'B) <title>', 'C) <meta name="author">', 'D) <link rel="canonical">'],
                  correctAnswers: ['B) <title>'],
                  explanation: 'The <title> tag is the single most important on-page SEO element.'
                },
                {
                  questionText: 'Q2. What is the purpose of Open Graph tags?',
                  type: 'mcq',
                  options: ['A) To improve Google search ranking', 'B) To control how pages appear when shared on social media', 'C) To add structured data for search engines', 'D) To track website analytics'],
                  correctAnswers: ['B) To control how pages appear when shared on social media'],
                  explanation: 'Open Graph (og:) meta tags control card previews on Facebook, LinkedIn, WhatsApp.'
                },
                {
                  questionText: 'Q3. What does a <link rel="canonical"> tag do?',
                  type: 'mcq',
                  options: ['A) Links to the CSS stylesheet', 'B) Tells search engines the preferred URL for duplicate content', 'C) Sets the page language', 'D) Connects to a CDN'],
                  correctAnswers: ['B) Tells search engines the preferred URL for duplicate content'],
                  explanation: 'Canonical tags point search engine bots to the authoritative master URL.'
                },
                {
                  questionText: 'Q4. Which meta robots value prevents a page from being indexed?',
                  type: 'mcq',
                  options: ['A) content="no-robots"', 'B) content="private"', 'C) content="noindex, nofollow"', 'D) content="block"'],
                  correctAnswers: ['C) content="noindex, nofollow"'],
                  explanation: 'noindex, nofollow instructs search crawlers not to index or follow links.'
                },
                {
                  questionText: 'Q5. What file tells search engine bots which pages to crawl?',
                  type: 'mcq',
                  options: ['A) sitemap.xml', 'B) seo.txt', 'C) robots.txt', 'D) crawler.conf'],
                  correctAnswers: ['C) robots.txt'],
                  explanation: 'robots.txt located at domain root defines crawling rules for bots.'
                }
              ]
            }
          }
        ]
      },
      {
        order: 11,
        title: 'Responsive Web Design & Viewport Optimization',
        description: 'Master responsive images with srcset, sizes, art direction with <picture>, AVIF/WebP formats, and lazy loading.',
        estimatedTimeMinutes: 20,
        lessons: [
          {
            title: 'Responsive Images & Mobile Optimization',
            order: 1,
            estimatedTimeMinutes: 20,
            contentHtml: `
              <h3>11.1 The Viewport Meta Tag</h3>
              <pre><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;</code></pre>
              <ul>
                <li><code>width=device-width</code> — Sets page width to device screen width</li>
                <li><code>initial-scale=1.0</code> — Sets initial zoom level to 100%</li>
                <li>Without this tag, mobile browsers render the desktop version and zoom out</li>
              </ul>

              <hr />

              <h3>11.2 Responsive Images with srcset</h3>
              <p><code>srcset</code> lets the browser choose the best image for the screen resolution:</p>
              <pre><code>&lt;!-- Resolution switching: same image, different sizes --&gt;
&lt;img
  src="photo-800.jpg"
  srcset="
    photo-400.jpg 400w,
    photo-800.jpg 800w,
    photo-1200.jpg 1200w
  "
  sizes="
    (max-width: 600px) 100vw,
    (max-width: 900px) 50vw,
    800px
  "
  alt="Mountain landscape"
/&gt;</code></pre>

              <h4>How it works:</h4>
              <ul>
                <li><code>srcset</code> lists image files with their widths (<code>w</code> descriptor)</li>
                <li><code>sizes</code> tells browser how wide the image will be displayed</li>
                <li>Browser picks the most appropriate image automatically</li>
              </ul>

              <hr />

              <h3>11.3 Art Direction with &lt;picture&gt;</h3>
              <p>Use <code>&lt;picture&gt;</code> when you want completely different images for different screen sizes (different crop, different content):</p>
              <pre><code>&lt;picture&gt;
  &lt;!-- Mobile: portrait crop --&gt;
  &lt;source
    media="(max-width: 480px)"
    srcset="hero-mobile.jpg"
  /&gt;

  &lt;!-- Tablet: medium crop --&gt;
  &lt;source
    media="(max-width: 1024px)"
    srcset="hero-tablet.jpg"
  /&gt;

  &lt;!-- Desktop: full wide image (fallback img required) --&gt;
  &lt;img src="hero-desktop.jpg" alt="Team photo at our Kathmandu office" /&gt;
&lt;/picture&gt;</code></pre>

              <hr />

              <h3>11.4 Modern Image Formats with &lt;picture&gt;</h3>
              <pre><code>&lt;picture&gt;
  &lt;!-- WebP for modern browsers --&gt;
  &lt;source type="image/webp" srcset="photo.webp" /&gt;

  &lt;!-- AVIF for cutting-edge browsers --&gt;
  &lt;source type="image/avif" srcset="photo.avif" /&gt;

  &lt;!-- JPEG fallback for older browsers --&gt;
  &lt;img src="photo.jpg" alt="Description" /&gt;
&lt;/picture&gt;</code></pre>

              <hr />

              <h3>11.5 Lazy Loading</h3>
              <pre><code>&lt;!-- Load image only when it enters the viewport --&gt;
&lt;img src="photo.jpg" alt="Description" loading="lazy" /&gt;

&lt;!-- Eager (default) — load immediately --&gt;
&lt;img src="hero.jpg" alt="Hero image" loading="eager" /&gt;

&lt;!-- Lazy load iframes --&gt;
&lt;iframe src="https://www.youtube.com/embed/..." loading="lazy"&gt;&lt;/iframe&gt;</code></pre>

              <h4>When to use:</h4>
              <ul>
                <li><code>loading="lazy"</code> — Images below the fold (not visible on first load)</li>
                <li><code>loading="eager"</code> — Hero images visible on page load (do NOT lazy load these)</li>
              </ul>

              <hr />

              <h3>11.6 Flexible Sizing</h3>
              <pre><code>&lt;!-- Always fill container width (responsive) --&gt;
&lt;img src="photo.jpg" alt="..." style="max-width: 100%; height: auto;" /&gt;

&lt;!-- Responsive video container (16:9 aspect ratio) --&gt;
&lt;div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;"&gt;
  &lt;iframe
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    src="https://www.youtube.com/embed/VIDEO_ID"
    allowfullscreen&gt;
  &lt;/iframe&gt;
&lt;/div&gt;</code></pre>
            `,
            codeSnippets: [
              {
                title: 'Modern Format Fallback',
                language: 'html',
                code: `<picture>\n  <source type="image/avif" srcset="photo.avif" />\n  <source type="image/webp" srcset="photo.webp" />\n  <img src="photo.jpg" alt="Fallback JPG" />\n</picture>`,
                explanation: 'Browser picks AVIF first, WebP second, or JPG fallback.'
              }
            ],
            callouts: [
              { type: 'tip', title: 'Art Direction vs Resolution Switching', content: 'Use srcset for same image at different resolutions; use <picture> when cropping or displaying different image content.' }
            ],
            hasQuiz: true,
            quiz: {
              title: 'Module 11 Checkpoint Quiz (5 Questions)',
              passingPercentage: 70,
              questions: [
                {
                  questionText: 'Q1. What does width=device-width in the viewport meta tag do?',
                  type: 'mcq',
                  options: ['A) Sets the image to device width', 'B) Sets the page width to match the device screen width', 'C) Locks the page to desktop width', 'D) Enables zoom'],
                  correctAnswers: ['B) Sets the page width to match the device screen width'],
                  explanation: 'width=device-width sets viewport width to actual hardware screen pixels.'
                },
                {
                  questionText: 'Q2. When should you use loading="lazy" on an image?',
                  type: 'mcq',
                  options: ['A) On all images', 'B) On the hero/banner image at the top', 'C) On images below the fold that don\'t need to load immediately', 'D) Never — it\'s not a real attribute'],
                  correctAnswers: ['C) On images below the fold that don\'t need to load immediately'],
                  explanation: 'loading="lazy" defers image fetching until near the viewport threshold.'
                },
                {
                  questionText: 'Q3. What is the purpose of the srcset attribute?',
                  type: 'mcq',
                  options: ['A) Sets multiple source files; browser picks the best for screen size/resolution', 'B) Lists backup images if the main one fails', 'C) Loads all listed images at once', 'D) Sets the image format'],
                  correctAnswers: ['A) Sets multiple source files; browser picks the best for screen size/resolution'],
                  explanation: 'srcset provides candidate image files with width descriptors (400w, 800w).'
                },
                {
                  questionText: 'Q4. When should you use <picture> instead of just srcset?',
                  type: 'mcq',
                  options: ['A) When you want a larger image', 'B) When you need art direction — different image content for different screen sizes', 'C) When using WebP format', 'D) Only for videos'],
                  correctAnswers: ['B) When you need art direction — different image content for different screen sizes'],
                  explanation: '<picture> handles art direction with media queries for different crops.'
                },
                {
                  questionText: 'Q5. Which image format provides the best compression while maintaining quality in modern browsers?',
                  type: 'mcq',
                  options: ['A) JPEG', 'B) PNG', 'C) GIF', 'D) WebP'],
                  correctAnswers: ['D) WebP'],
                  explanation: 'WebP provides superior lossy and lossless compression compared to JPEG/PNG.'
                }
              ]
            }
          }
        ]
      },
      {
        order: 12,
        title: 'Advanced HTML5 Web APIs & Local Storage',
        description: 'Explore HTML5 Canvas, inline SVG graphics, localStorage vs sessionStorage vs cookies, Geolocation, Drag & Drop, and History APIs.',
        estimatedTimeMinutes: 30,
        lessons: [
          {
            title: 'HTML5 Canvas, Web Storage & Geolocation',
            order: 1,
            estimatedTimeMinutes: 30,
            contentHtml: `
              <h3>12.1 HTML5 Canvas</h3>
              <p>The <code>&lt;canvas&gt;</code> element creates a drawing surface controlled by JavaScript:</p>
              <pre><code>&lt;canvas id="myCanvas" width="500" height="300"&gt;&lt;/canvas&gt;

&lt;script&gt;
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');

  // Draw a filled rectangle
  ctx.fillStyle = '#3498db';
  ctx.fillRect(50, 50, 200, 100);

  // Draw a circle
  ctx.beginPath();
  ctx.arc(300, 100, 50, 0, 2 * Math.PI);
  ctx.fillStyle = '#e74c3c';
  ctx.fill();

  // Draw text
  ctx.font = '24px Arial';
  ctx.fillStyle = '#2c3e50';
  ctx.fillText('Hello Canvas!', 50, 250);

  // Draw a line
  ctx.beginPath();
  ctx.moveTo(0, 150);
  ctx.lineTo(500, 150);
  ctx.strokeStyle = '#27ae60';
  ctx.lineWidth = 2;
  ctx.stroke();
&lt;/script&gt;</code></pre>

              <h3>12.2 Web Storage API</h3>
              <pre><code>// Save data across browser restarts
localStorage.setItem('username', 'Pankaj');
const user = JSON.parse(localStorage.getItem('user'));

// Save data for active tab session
sessionStorage.setItem('cart', JSON.stringify(cartItems));</code></pre>

              <h3>12.3 Geolocation API</h3>
              <pre><code>navigator.geolocation.getCurrentPosition(
  (pos) =&gt; console.log(pos.coords.latitude, pos.coords.longitude),
  (err) =&gt; console.error(err)
);</code></pre>
            `,
            codeSnippets: [
              {
                title: 'localStorage Object Persistence',
                language: 'javascript',
                code: `const student = { name: 'Pankaj Baduwal', course: 'HTML5 Mastery' };\nlocalStorage.setItem('student', JSON.stringify(student));\nconst retrieved = JSON.parse(localStorage.getItem('student'));`,
                explanation: 'Objects must be converted to JSON strings before storing in localStorage.'
              }
            ],
            callouts: [
              { type: 'info', title: 'SVG vs Canvas', content: 'SVG is DOM vector graphics (best for icons/charts); Canvas is raster pixel drawing (best for games/animations).' }
            ],
            hasQuiz: true,
            quiz: {
              title: 'Module 12 Checkpoint Quiz',
              passingPercentage: 70,
              questions: [
                {
                  questionText: 'What method is used to get the 2D drawing context from a canvas element?',
                  type: 'mcq',
                  options: ['canvas.getContext(\'2d\')', 'canvas.draw2D()', 'canvas.context(\'2d\')', 'canvas.get2DContext()'],
                  correctAnswers: ['canvas.getContext(\'2d\')'],
                  explanation: 'getContext(\'2d\') returns the CanvasRenderingContext2D drawing context.'
                },
                {
                  questionText: 'What is the main difference between localStorage and sessionStorage?',
                  type: 'mcq',
                  options: ['localStorage stores more data', 'sessionStorage is more secure', 'localStorage persists until cleared; sessionStorage clears when tab closes', 'They are identical'],
                  correctAnswers: ['localStorage persists until cleared; sessionStorage clears when tab closes'],
                  explanation: 'localStorage persists across sessions; sessionStorage expires when tab closes.'
                },
                {
                  questionText: 'How must objects be stored in localStorage?',
                  type: 'mcq',
                  options: ['As-is using direct assignment', 'Converted to a JSON string using JSON.stringify()', 'Using the .store() method', 'As binary data'],
                  correctAnswers: ['Converted to a JSON string using JSON.stringify()'],
                  explanation: 'Web storage key-values store strings only, so objects require JSON.stringify().'
                },
                {
                  questionText: 'Which API asks the user\'s permission to access device location?',
                  type: 'mcq',
                  options: ['navigator.location', 'window.position', 'navigator.geolocation', 'document.geo'],
                  correctAnswers: ['navigator.geolocation'],
                  explanation: 'navigator.geolocation provides device position access.'
                },
                {
                  questionText: 'Which is better for scalable logos and icons — Canvas or SVG?',
                  type: 'mcq',
                  options: ['Canvas, because it\'s pixel-perfect', 'SVG, because it\'s vector-based and scales without quality loss', 'Canvas, because it\'s faster', 'They are equivalent'],
                  correctAnswers: ['SVG, because it\'s vector-based and scales without quality loss'],
                  explanation: 'SVG is scalable vector XML format ideal for logos and icons.'
                }
              ]
            }
          }
        ]
      },
      {
        order: 13,
        title: 'Web Standards, Validation & Clean Code',
        description: 'Understand W3C HTML validation, common errors, indentation rules, cross-browser testing, and clean code comments.',
        estimatedTimeMinutes: 20,
        lessons: [
          {
            title: 'W3C Code Validation & Best Practices',
            order: 1,
            estimatedTimeMinutes: 20,
            contentHtml: `
              <h3>13.1 W3C Markup Validation</h3>
              <p>Validate your HTML at <a href="https://validator.w3.org" target="_blank" rel="noopener noreferrer">validator.w3.org</a> to catch missing tags, invalid attribute quotes, or duplicate IDs.</p>

              <h3>13.2 Clean Code Checklist</h3>
              <ol>
                <li>Always declare <code>&lt;!DOCTYPE html&gt;</code>.</li>
                <li>Use lowercase for all tag and attribute names.</li>
                <li>Always quote attribute values (e.g. <code>class="btn"</code>).</li>
                <li>Indent nested elements consistently with 2 or 4 spaces.</li>
                <li>Always explicitly close non-void tags.</li>
                <li>Use unique IDs per document.</li>
              </ol>
            `,
            codeSnippets: [
              {
                title: 'Valid Clean HTML Structure',
                language: 'html',
                code: `<!-- ================= HEADER ================= -->\n<header>\n  <nav>\n    <ul>\n      <li><a href="/">Home</a></li>\n    </ul>\n  </nav>\n</header>`,
                explanation: 'Demonstrates clean indentation and section header comments.'
              }
            ],
            callouts: [
              { type: 'warning', title: 'Duplicate ID Error', content: 'IDs must be 100% unique per document. Reusing duplicate IDs causes W3C validation errors and JS selector bugs.' }
            ],
            hasQuiz: true,
            quiz: {
              title: 'Module 13 Checkpoint Quiz',
              passingPercentage: 70,
              questions: [
                {
                  questionText: 'Which organization maintains web standards and provides the HTML validator?',
                  type: 'mcq',
                  options: ['IEEE', 'ISO', 'W3C', 'IETF'],
                  correctAnswers: ['W3C'],
                  explanation: 'W3C (World Wide Web Consortium) sets official web standards.'
                },
                {
                  questionText: 'What will the W3C validator report if you use the same id twice on a page?',
                  type: 'mcq',
                  options: ['A warning only', 'Nothing — it\'s allowed', 'An error — IDs must be unique', 'It auto-corrects to class names'],
                  correctAnswers: ['An error — IDs must be unique'],
                  explanation: 'Duplicate IDs violate W3C standards and throw validation errors.'
                },
                {
                  questionText: 'What is the correct practice for attribute values in HTML5?',
                  type: 'mcq',
                  options: ['Always use single quotes', 'Quotes are optional for all attributes', 'Always use double quotes', 'Never use quotes'],
                  correctAnswers: ['Always use double quotes'],
                  explanation: 'Standard clean code style requires double quotes for attribute values.'
                },
                {
                  questionText: 'What tool shows browser support for HTML5 features?',
                  type: 'mcq',
                  options: ['W3C Validator', 'Can I Use (caniuse.com)', 'Lighthouse', 'Web.dev'],
                  correctAnswers: ['Can I Use (caniuse.com)'],
                  explanation: 'caniuse.com tracks frontend feature compatibility tables across browsers.'
                },
                {
                  questionText: 'What is the recommended indentation for nested HTML elements?',
                  type: 'mcq',
                  options: ['Tabs only', 'No indentation needed', '2 or 4 spaces consistently', '8 spaces'],
                  correctAnswers: ['2 or 4 spaces consistently'],
                  explanation: 'Consistent 2 or 4 space indentation maximizes code readability.'
                }
              ]
            }
          }
        ]
      },
      {
        order: 14,
        title: 'Real-World Portfolio & Capstone Projects',
        description: 'Build three complete capstone projects: Personal Developer Portfolio, Restaurant Website, and Formatted HTML Resume.',
        estimatedTimeMinutes: 45,
        lessons: [
          {
            title: 'Building a Complete Personal Portfolio Webpage',
            order: 1,
            estimatedTimeMinutes: 45,
            contentHtml: `
              <h3>14.1 Capstone Projects Overview</h3>
              <p>In this module, you build three complete portfolio projects using everything you learned:</p>
              <ol>
                <li><strong>Personal Developer Portfolio:</strong> Multi-section website with skip-links, hero figure, project cards with <code>&lt;article&gt;</code>, skills list, and footer.</li>
                <li><strong>Restaurant Website:</strong> Business menu page with <code>&lt;section&gt;</code> and <code>&lt;dl&gt;</code> price terms.</li>
                <li><strong>Professional HTML Resume:</strong> Contact <code>&lt;address&gt;</code>, summary, work experience with <code>&lt;time&gt;</code> datetime attributes.</li>
              </ol>
            `,
            codeSnippets: [
              {
                title: 'Project Card Article Structure',
                language: 'html',
                code: `<article class="project-card">\n  <figure>\n    <img src="images/project-1.png" alt="Restaurant site screenshot" />\n    <figcaption>Himalayan Bites Website</figcaption>\n  </figure>\n  <h3>Himalayan Bites</h3>\n  <p>A responsive multi-page restaurant site built with semantic HTML.</p>\n</article>`,
                explanation: 'Self-contained project card wrapped in semantic <article> and <figure>.'
              }
            ],
            callouts: [
              { type: 'tip', title: 'Folder Structure', content: 'Keep projects clean with dedicated subfolders: index.html, css/style.css, images/profile.jpg.' }
            ],
            hasQuiz: true,
            quiz: {
              title: 'Module 14 Checkpoint Quiz',
              passingPercentage: 70,
              questions: [
                {
                  questionText: 'In a portfolio project structure, where should CSS files be placed?',
                  type: 'mcq',
                  options: ['In the root folder next to HTML files', 'In a dedicated css/ subfolder', 'Inside the <head> tag as inline styles only', 'In the images/ folder'],
                  correctAnswers: ['In a dedicated css/ subfolder'],
                  explanation: 'CSS files belong in a dedicated css/ directory for project organization.'
                },
                {
                  questionText: 'Why should you use <article> for each project card in a portfolio?',
                  type: 'mcq',
                  options: ['It makes cards look better', 'Each project is self-contained content that makes sense independently', '<article> adds built-in styling', '<div> tags don\'t work for cards'],
                  correctAnswers: ['Each project is self-contained content that makes sense independently'],
                  explanation: '<article> tags indicate self-contained reusable content items.'
                },
                {
                  questionText: 'Which element should be used for contact information in a resume footer?',
                  type: 'mcq',
                  options: ['<contact>', '<p>', '<address>', '<footer>'],
                  correctAnswers: ['<address>'],
                  explanation: '<address> defines contact information for author or document.'
                },
                {
                  questionText: 'What attribute should be added to images in a project gallery below the fold?',
                  type: 'mcq',
                  options: ['loading="eager"', 'loading="lazy"', 'async="true"', 'defer="true"'],
                  correctAnswers: ['loading="lazy"'],
                  explanation: 'loading="lazy" defers off-screen gallery images until scrolled to.'
                },
                {
                  questionText: 'What is the purpose of aria-label="Pankaj\'s GitHub profile" on a social media link?',
                  type: 'mcq',
                  options: ['It adds a tooltip that appears on hover', 'It provides descriptive text for screen reader users who can\'t see the icon/text', 'It improves the link\'s Google ranking', 'It opens the link in a new tab'],
                  correctAnswers: ['It provides descriptive text for screen reader users who can\'t see the icon/text'],
                  explanation: 'aria-label provides accessible names for icon-only social media buttons.'
                }
              ]
            }
          }
        ]
      },
      {
        order: 15,
        title: 'Final Assessment & Professional Certification Exam',
        description: 'Complete course recap, key formulas, self-assessment checklist, and the 30-Question Final Certification Examination.',
        estimatedTimeMinutes: 30,
        lessons: [
          {
            title: 'Certification Exam Preparation & Summary',
            order: 1,
            estimatedTimeMinutes: 30,
            contentHtml: `
              <h3>15.1 Course Summary</h3>
              <p>Congratulations on completing all 14 modules! Here is a complete recap of everything you have learned:</p>

              <h4>Foundation (Modules 1–3):</h4>
              <ul>
                <li>How the internet and client-server architecture works</li>
                <li>HTML document structure, DOCTYPE, boilerplate</li>
                <li>All text formatting elements and when to use them</li>
                <li>Creating links: absolute, relative, email, phone, bookmark</li>
              </ul>

              <h4>Content Elements (Modules 4–6):</h4>
              <ul>
                <li>Images with proper alt text, audio, video, iframes</li>
                <li>Unordered, ordered, and description lists with nesting</li>
                <li>Complex data tables with rowspan, colspan, and accessibility</li>
              </ul>

              <h4>Interactive Features (Module 7):</h4>
              <ul>
                <li>All form input types and their HTML5 validation</li>
                <li>Labels, fieldsets, and accessible form structure</li>
              </ul>

              <h4>Advanced Structure (Modules 8–9):</h4>
              <ul>
                <li>Full semantic HTML5 page architecture</li>
                <li>ARIA roles, states, and properties</li>
                <li>WCAG 2.1 accessibility principles</li>
              </ul>

              <h4>Optimization (Modules 10–11):</h4>
              <ul>
                <li>SEO meta tags, Open Graph, Twitter Cards</li>
                <li>Responsive images with srcset and &lt;picture&gt;</li>
                <li>Lazy loading and viewport optimization</li>
              </ul>

              <h4>Advanced APIs (Module 12):</h4>
              <ul>
                <li>HTML5 Canvas drawing API</li>
                <li>SVG inline graphics</li>
                <li>localStorage and sessionStorage</li>
                <li>Geolocation API</li>
              </ul>

              <h4>Professional Skills (Modules 13–14):</h4>
              <ul>
                <li>W3C validation and code best practices</li>
                <li>Cross-browser testing</li>
                <li>Three complete real-world projects</li>
              </ul>

              <hr />

              <h3>15.2 Key Formulas to Remember</h3>
              <pre><code>&lt;!-- Perfect HTML5 Boilerplate --&gt;
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8" /&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;
  &lt;meta name="description" content="Page description for SEO" /&gt;
  &lt;title&gt;Page Title&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;header&gt;
    &lt;nav&gt;...&lt;/nav&gt;
  &lt;/header&gt;
  &lt;main&gt;
    &lt;article&gt;...&lt;/article&gt;
    &lt;aside&gt;...&lt;/aside&gt;
  &lt;/main&gt;
  &lt;footer&gt;...&lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

              <hr />

              <h3>15.3 Self-Assessment Checklist</h3>
              <p>Before the exam, verify you can do all of the following from memory:</p>

              <h4>HTML Structure:</h4>
              <ul>
                <li>✅ Write a complete HTML5 boilerplate</li>
                <li>✅ Explain every tag in the &lt;head&gt; section</li>
                <li>✅ Structure a page with semantic HTML elements</li>
              </ul>

              <h4>Text &amp; Links:</h4>
              <ul>
                <li>✅ Use all six heading levels correctly</li>
                <li>✅ Create bold, italic, subscript, superscript text</li>
                <li>✅ Create links that open in new tabs safely</li>
              </ul>

              <h4>Media:</h4>
              <ul>
                <li>✅ Embed a responsive image with alt text</li>
                <li>✅ Add an HTML5 video with controls and poster</li>
                <li>✅ Embed a YouTube video with iframe</li>
              </ul>

              <h4>Forms:</h4>
              <ul>
                <li>✅ Create a form with at least 5 different input types</li>
                <li>✅ Add proper labels and fieldsets</li>
                <li>✅ Use HTML5 validation attributes</li>
              </ul>

              <h4>Accessibility:</h4>
              <ul>
                <li>✅ Add ARIA roles to landmark elements</li>
                <li>✅ Use aria-label on icon buttons</li>
                <li>✅ Create a skip navigation link</li>
              </ul>

              <h4>SEO:</h4>
              <ul>
                <li>✅ Write all essential meta tags</li>
                <li>✅ Add Open Graph tags for social sharing</li>
              </ul>
            `,
            codeSnippets: [
              {
                title: 'Master HTML5 Boilerplate',
                language: 'html',
                code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>Certification Exam</title>\n</head>\n<body>\n  <header><nav>...</nav></header>\n  <main><article>...</article></main>\n  <footer>...</footer>\n</body>\n</html>`,
                explanation: 'Master boilerplate template to review before the final exam.'
              }
            ],
            callouts: [
              { type: 'warning', title: 'Certification Passing Score', content: 'You must achieve 70% or higher on the 30-Question Final Exam to issue your signed certificate.' }
            ],
            hasQuiz: true,
            quiz: {
              title: 'FINAL CERTIFICATION EXAM (30 Questions — Covering All 15 Modules)',
              passingPercentage: 70,
              questions: [
                { questionText: 'Q1. What is the first line of every HTML5 document?', type: 'mcq', options: ['<html>', '<head>', '<!DOCTYPE html>', '<!-- HTML5 -->'], correctAnswers: ['<!DOCTYPE html>'], explanation: '<!DOCTYPE html> must be on line 1.' },
                { questionText: 'Q2. Which tag creates the largest heading on a page?', type: 'mcq', options: ['<h6>', '<heading>', '<h1>', '<big>'], correctAnswers: ['<h1>'], explanation: '<h1> is the highest level heading.' },
                { questionText: 'Q3. What attribute must every <img> tag include for accessibility?', type: 'mcq', options: ['title', 'src', 'alt', 'width'], correctAnswers: ['alt'], explanation: 'alt text is required for screen readers and accessibility.' },
                { questionText: 'Q4. What does the <strong> tag convey that <b> does not?', type: 'mcq', options: ['Stronger visual boldness', 'Semantic importance for screen readers', 'Bold text in all browsers', 'They are identical'], correctAnswers: ['Semantic importance for screen readers'], explanation: '<strong> conveys strong importance to assistive tech.' },
                { questionText: 'Q5. Which HTML element is used to group radio buttons with a label?', type: 'mcq', options: ['<group>', '<section>', '<fieldset>', '<form>'], correctAnswers: ['<fieldset>'], explanation: '<fieldset> groups related form inputs with a <legend>.' },
                { questionText: 'Q6. What is the correct way to create a link that opens an email client?', type: 'mcq', options: ['<a href="email:user@example.com">', '<a href="mail:user@example.com">', '<a href="mailto:user@example.com">', '<a href="send:user@example.com">'], correctAnswers: ['<a href="mailto:user@example.com">'], explanation: 'mailto: initiates default mail app.' },
                { questionText: 'Q7. Which attribute in <ol> makes the list count in reverse?', type: 'mcq', options: ['order="reverse"', 'reversed', 'type="reverse"', 'direction="rtl"'], correctAnswers: ['reversed'], explanation: 'reversed counts descending.' },
                { questionText: 'Q8. How do you make a table cell span 3 columns?', type: 'mcq', options: ['<td span="3">', '<td columns="3">', '<td colspan="3">', '<td width="3">'], correctAnswers: ['<td colspan="3">'], explanation: 'colspan="3" merges cells horizontally across 3 columns.' },
                { questionText: 'Q9. Which semantic element should contain the main navigation of a website?', type: 'mcq', options: ['<menu>', '<ul>', '<navigation>', '<nav>'], correctAnswers: ['<nav>'], explanation: '<nav> holds primary navigation links.' },
                { questionText: 'Q10. What does role="alert" do in ARIA?', type: 'mcq', options: ['Styles the element red', 'Announces content changes to screen readers immediately', 'Adds a browser alert popup', 'Marks content as important'], correctAnswers: ['Announces content changes to screen readers immediately'], explanation: 'role="alert" triggers immediate screen reader speech.' },
                { questionText: 'Q11. Which meta tag is most critical for mobile responsiveness?', type: 'mcq', options: ['<meta name="mobile" content="true">', '<meta name="viewport" content="width=device-width, initial-scale=1.0">', '<meta name="screen" content="responsive">', '<meta name="device" content="mobile">'], correctAnswers: ['<meta name="viewport" content="width=device-width, initial-scale=1.0">'], explanation: 'viewport meta tag enables proper mobile scaling.' },
                { questionText: 'Q12. Which Open Graph property sets the image that appears when sharing on social media?', type: 'mcq', options: ['og:thumbnail', 'og:photo', 'og:image', 'og:picture'], correctAnswers: ['og:image'], explanation: 'og:image defines the preview thumbnail on social platforms.' },
                { questionText: 'Q13. What does <abbr title="World Wide Web">WWW</abbr> do?', type: 'mcq', options: ['Creates a link to a definition', 'Shows the full form as a tooltip on hover', 'Makes the text bold', 'Adds a footnote'], correctAnswers: ['Shows the full form as a tooltip on hover'], explanation: '<abbr title="..."> renders native tooltip on hover.' },
                { questionText: 'Q14. Which input type shows a color picker in the browser?', type: 'mcq', options: ['type="picker"', 'type="hue"', 'type="color"', 'type="rgb"'], correctAnswers: ['type="color"'], explanation: 'type="color" launches native color picker.' },
                { questionText: 'Q15. What is the purpose of <figcaption>?', type: 'mcq', options: ['To add a border to images', 'To provide a visible caption for a <figure> element', 'To hide image alt text', 'To link images to other pages'], correctAnswers: ['To provide a visible caption for a <figure> element'], explanation: '<figcaption> provides visual caption for <figure> media.' },
                { questionText: 'Q16. Where does localStorage data persist?', type: 'mcq', options: ['On the web server', 'In a cookie with expiry', 'In the browser until manually cleared', 'Only for the current browser session'], correctAnswers: ['In the browser until manually cleared'], explanation: 'localStorage persists until explicitly cleared.' },
                { questionText: 'Q17. What does srcset do on an <img> tag?', type: 'mcq', options: ['Provides multiple source files; the browser selects the best for screen size', 'Adds a backup image if the main one fails', 'Sets the image source for IE browsers', 'Loads all listed images simultaneously'], correctAnswers: ['Provides multiple source files; the browser selects the best for screen size'], explanation: 'srcset supplies multiple resolution candidates for responsive images.' },
                { questionText: 'Q18. Which W3C tool checks your HTML for errors and standards compliance?', type: 'mcq', options: ['Chrome DevTools', 'W3C Markup Validator', 'Can I Use', 'Lighthouse'], correctAnswers: ['W3C Markup Validator'], explanation: 'W3C Markup Validator checks HTML compliance.' },
                { questionText: 'Q19. What tag is used to display a horizontal dividing line?', type: 'mcq', options: ['<line>', '<divider>', '<br />', '<hr />'], correctAnswers: ['<hr />'], explanation: '<hr /> creates a thematic horizontal divider.' },
                { questionText: 'Q20. Which attribute links a <label> to an <input>?', type: 'mcq', options: ['name on both elements', 'for on the label matching id on the input', 'link on the label', 'target on the input'], correctAnswers: ['for on the label matching id on the input'], explanation: 'for="X" connects with input id="X".' },
                { questionText: 'Q21. What does loading="lazy" do on an image?', type: 'mcq', options: ['Makes the image load in low quality first', 'Defers image loading until it\'s near the viewport', 'Loads the image in a background thread', 'Lazy loads the entire page'], correctAnswers: ['Defers image loading until it\'s near the viewport'], explanation: 'loading="lazy" defers image fetching until near viewport.' },
                { questionText: 'Q22. Which Canvas method begins a new path for drawing?', type: 'mcq', options: ['ctx.newPath()', 'ctx.startPath()', 'ctx.beginPath()', 'ctx.createPath()'], correctAnswers: ['ctx.beginPath()'], explanation: 'ctx.beginPath() resets current path.' },
                { questionText: 'Q23. What does aria-expanded="false" communicate?', type: 'mcq', options: ['The element has no content', 'A collapsible region is currently closed', 'The element is disabled', 'The element is hidden'], correctAnswers: ['A collapsible region is currently closed'], explanation: 'aria-expanded="false" indicates closed accordion/menu state.' },
                { questionText: 'Q24. In which section of a table should summary or total rows appear?', type: 'mcq', options: ['<thead>', '<tbody>', '<tfoot>', '<tsummary>'], correctAnswers: ['<tfoot>'], explanation: '<tfoot> holds summary/total calculation rows.' },
                { questionText: 'Q25. What is the purpose of <link rel="canonical">?', type: 'mcq', options: ['Links to the main CSS file', 'Tells search engines the preferred URL to avoid duplicate content penalties', 'Connects the page to a CDN', 'Marks the page as the main page of the site'], correctAnswers: ['Tells search engines the preferred URL to avoid duplicate content penalties'], explanation: 'Canonical links identify primary master URLs.' },
                { questionText: 'Q26. What does tabindex="-1" do to an element?', type: 'mcq', options: ['Makes it the first element in tab order', 'Removes it from keyboard tab navigation but allows programmatic focus', 'Makes it non-interactive permanently', 'Adds it to a reversed tab order'], correctAnswers: ['Removes it from keyboard tab navigation but allows programmatic focus'], explanation: 'tabindex="-1" removes from tab key navigation.' },
                { questionText: 'Q27. Which <ol> attribute controls where numbering starts?', type: 'mcq', options: ['begin', 'from', 'start', 'number'], correctAnswers: ['start'], explanation: 'start attribute sets starting number.' },
                { questionText: 'Q28. Which of these is NOT a valid HTML5 semantic element?', type: 'mcq', options: ['<article>', '<section>', '<content>', '<aside>'], correctAnswers: ['<content>'], explanation: '<content> is not a standard HTML5 semantic element.' },
                { questionText: 'Q29. What happens to data in sessionStorage when the browser tab is closed?', type: 'mcq', options: ['It is saved to localStorage automatically', 'It remains until the browser is closed', 'It is cleared immediately', 'It is sent to the server'], correctAnswers: ['It is cleared immediately'], explanation: 'sessionStorage expires when tab closes.' },
                { questionText: 'Q30. Which Geolocation API method continuously tracks position changes?', type: 'mcq', options: ['navigator.geolocation.getCurrentPosition()', 'navigator.geolocation.trackPosition()', 'navigator.geolocation.watchPosition()', 'navigator.geolocation.followPosition()'], correctAnswers: ['navigator.geolocation.watchPosition()'], explanation: 'watchPosition() returns continuous location updates.' }
              ]
            }
          }
        ]
      }
    ];

    // Seed all 15 modules & lessons into MongoDB
    for (const mData of modulesData) {
      const mod = await CertModule.create({
        certificationId: htmlCert._id,
        title: mData.title,
        description: mData.description,
        order: mData.order,
        estimatedTimeMinutes: mData.estimatedTimeMinutes
      });

      console.log(`📦 Created Module ${mData.order}: ${mData.title}`);

      for (const lData of mData.lessons) {
        await CertLesson.create({
          certificationId: htmlCert._id,
          moduleId: mod._id,
          title: lData.title,
          order: lData.order,
          estimatedTimeMinutes: lData.estimatedTimeMinutes,
          contentHtml: lData.contentHtml,
          codeSnippets: lData.codeSnippets || [],
          callouts: lData.callouts || [],
          hasQuiz: lData.hasQuiz || false,
          quiz: lData.quiz || null
        });
      }
    }

    console.log('🎉 All 15 Modules, 75 Checkpoint Quiz Questions & 30 Final Exam Questions seeded successfully into MongoDB!');

  } catch (err) {
    console.error('❌ Error seeding certification curriculum:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
