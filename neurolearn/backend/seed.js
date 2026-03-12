const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const Question = require('./models/Question');

dotenv.config();

const courses = [
  { _id: new mongoose.Types.ObjectId('60d5ec496f412a14b01e1111'), title: 'Data Structures & Algorithms', topicsCount: 24, progress: 65, icon: '🧠', difficulty: 'Hard', category: 'algorithms' },
  { _id: new mongoose.Types.ObjectId('60d5ec496f412a14b01e1112'), title: 'JavaScript Mastery', topicsCount: 18, progress: 80, icon: '⚡', difficulty: 'Medium', category: 'web' },
  { _id: new mongoose.Types.ObjectId('60d5ec496f412a14b01e1113'), title: 'System Design Basics', topicsCount: 12, progress: 20, icon: '🏗️', difficulty: 'Hard', category: 'systems' },
  { _id: new mongoose.Types.ObjectId('60d5ec496f412a14b01e1114'), title: 'Web Fundamentals', topicsCount: 20, progress: 95, icon: '🌐', difficulty: 'Easy', category: 'web' },
  { _id: new mongoose.Types.ObjectId('60d5ec496f412a14b01e1115'), title: 'Database Design', topicsCount: 16, progress: 45, icon: '🗄️', difficulty: 'Medium', category: 'databases' },
  { _id: new mongoose.Types.ObjectId('60d5ec496f412a14b01e1116'), title: 'Python for Data Science', topicsCount: 10, progress: 0, icon: '🐍', difficulty: 'Medium', category: 'ai' },
  { _id: new mongoose.Types.ObjectId('60d5ec496f412a14b01e1117'), title: 'React.js Essentials', topicsCount: 10, progress: 0, icon: '⚛️', difficulty: 'Medium', category: 'web' },
  { _id: new mongoose.Types.ObjectId('60d5ec496f412a14b01e1118'), title: 'DevOps & Deployment', topicsCount: 10, progress: 0, icon: '🚀', difficulty: 'Hard', category: 'backend' },
  { _id: new mongoose.Types.ObjectId('60d5ec496f412a14b01e1119'), title: 'Computer Networks', topicsCount: 10, progress: 0, icon: '📡', difficulty: 'Medium', category: 'systems' },
  { _id: new mongoose.Types.ObjectId('60d5ec496f412a14b01e111a'), title: 'Operating Systems', topicsCount: 10, progress: 0, icon: '🖥️', difficulty: 'Hard', category: 'systems' },
  { _id: new mongoose.Types.ObjectId('60d5ec496f412a14b01e111b'), title: 'Computer Organization', topicsCount: 10, progress: 0, icon: '⚙️', difficulty: 'Hard', category: 'systems' },
  { _id: new mongoose.Types.ObjectId('60d5ec496f412a14b01e111c'), title: 'Node.js Mastery', topicsCount: 10, progress: 0, icon: '🟢', difficulty: 'Medium', category: 'backend' },
  { _id: new mongoose.Types.ObjectId('60d5ec496f412a14b01e111d'), title: 'Express.js Framework', topicsCount: 10, progress: 0, icon: '🚂', difficulty: 'Medium', category: 'backend' },
  { _id: new mongoose.Types.ObjectId('60d5ec496f412a14b01e111e'), title: 'MongoDB Deep Dive', topicsCount: 10, progress: 0, icon: '🍃', difficulty: 'Hard', category: 'databases' },
  { _id: new mongoose.Types.ObjectId('60d5ec496f412a14b01e111f'), title: 'AI & Machine Learning', topicsCount: 10, progress: 0, icon: '🤖', difficulty: 'Hard', category: 'ai' }
];

const questions = [
  // Course 1: Data Structures & Algorithms
  { text: 'Which complexity is commonly associated with an algorithm that halves the data each step?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(log n)'], correct: 3, topic: 'Introduction to Big O Notation', topicId: '1' },
  { text: 'What is the standard time complexity for accessing an element in an array by index?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'], correct: 2, topic: 'Arrays & Strings', topicId: '1' },
  { text: 'Which scenario makes a Linked List superior to an Array?', options: ['Random index access', 'Frequent insertions/deletions at the head', 'Memory locality tracking', 'Binary searching'], correct: 1, topic: 'Linked Lists', topicId: '1' },
  { text: 'Which data structure uses LIFO (Last In, First Out)?', options: ['Queue', 'Array', 'Stack', 'Linked List'], correct: 2, topic: 'Stacks & Queues', topicId: '1' },
  { text: 'What is a common potential issue when using Hash Tables?', options: ['Stack overflow', 'Hash collisions', 'Infinite loops', 'Depth limitations'], correct: 1, topic: 'Hash Tables', topicId: '1' },
  { text: 'What is the maximum number of children a node can have in a Binary Tree?', options: ['1', '2', '3', 'Unlimited'], correct: 1, topic: 'Binary Trees', topicId: '1' },
  { text: 'Which graph traversal algorithm uses a Queue under the hood?', options: ['Depth-First Search (DFS)', 'Dijkstra', 'Breadth-First Search (BFS)', 'A*'], correct: 2, topic: 'Graph Traversal', topicId: '1' },
  { text: 'Which sorting algorithm has the best average case time complexity?', options: ['Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Selection Sort'], correct: 2, topic: 'Sorting Algorithms', topicId: '1' },
  { text: 'What are the two key ingredients for Dynamic Programming?', options: ['Overlapping Subproblems & Optimal Substructure', 'Recursion & Base Cases', 'Queues & Stacks', 'Hashes & Arrays'], correct: 0, topic: 'Dynamic Programming', topicId: '1' },
  { text: 'What must every recursive function have to prevent an infinite loop?', options: ['A while loop', 'A return statement immediately', 'A base case', 'A counter variable'], correct: 2, topic: 'Recursion Deep Dive', topicId: '1' },

  // Course 2: JavaScript Mastery
  { text: 'Which keyword in JS creates a block-scoped mutable variable?', options: ['var', 'let', 'const', 'function'], correct: 1, topic: 'Variables & Data Types', topicId: '2' },
  { text: 'What is a closure in JavaScript?', options: ['A function bundled with its lexical environment', 'A way to close browser tabs', 'A syntax for class components', 'A type of promise'], correct: 0, topic: 'Functions & Closures', topicId: '2' },
  { text: 'How do you correctly declare a class method in ES6?', options: ['function myMethod() {}', 'classMethod: function() {}', 'myMethod() {}', 'method = () => {}'], correct: 2, topic: 'Prototypes & Classes', topicId: '2' },
  { text: "What does the 'await' operator do?", options: ['Pauses execution until a promise resolves', 'Forces the CPU to sleep', 'Creates a new Promise', 'Throws an error synchronously'], correct: 0, topic: 'Async/Await & Promises', topicId: '2' },
  { text: 'Which of the following is an ES6 feature?', options: ['var scoping', 'Arrow Functions', 'XMLHttpRequest', 'document.write'], correct: 1, topic: 'ES6+ Features', topicId: '2' },
  { text: 'What is the main purpose of a Bundler like Webpack?', options: ['To optimize images only', 'To compile SCSS to CSS', 'To combine/minify JS modules', 'To write server-side code'], correct: 2, topic: 'Modules & Bundlers', topicId: '2' },
  { text: 'Which method selects elements by their CSS class?', options: ['getElementById', 'querySelectorAll', 'querySelector', 'Both B & C'], correct: 3, topic: 'DOM Manipulation', topicId: '2' },
  { text: 'What component of the JS Engine holds asynchronous callbacks?', options: ['The Call Stack', 'The Heap', 'The Task/Callback Queue', 'The DOM API'], correct: 2, topic: 'Event Loop', topicId: '2' },
  { text: 'What construct is used to handle exceptions in JS?', options: ['if/else', 'switch/case', 'throw/catch', 'try/catch'], correct: 3, topic: 'Error Handling', topicId: '2' },
  { text: 'In Jest, what keyword is used to group tests?', options: ['test', 'group', 'describe', 'suite'], correct: 2, topic: 'Testing with Jest', topicId: '2' },

  // Course 3: System Design Basics
  { text: 'What does "Horizontal Scaling" mean?', options: ['Adding more CPU/RAM', 'Adding more servers', 'Changing DB schema', 'Moving to cloud'], correct: 1, topic: 'Scalability Basics', topicId: '3' },
  { text: 'What is the role of a Load Balancer?', options: ['Secure the DB', 'Compile app', 'Distribute network traffic', 'Store sessions'], correct: 2, topic: 'Load Balancing', topicId: '3' },
  { text: 'Which cache eviction policy removes the oldest accessed item?', options: ['FIFO', 'LRU', 'LFU', 'Random'], correct: 1, topic: 'Caching Strategies', topicId: '3' },
  { text: 'What is Database Sharding?', options: ['Encrypting a DB', 'Partitioning data across servers', 'Indexing columns', 'Copying exact replica'], correct: 1, topic: 'Database Sharding', topicId: '3' },
  { text: 'What does the "C" in CAP Theorem stand for?', options: ['Concurrency', 'Continuity', 'Consistency', 'Cloud'], correct: 2, topic: 'CAP Theorem', topicId: '3' },
  { text: 'What represents the core ideology of Microservices?', options: ['Giant codebase', 'Independently deployable services', 'Monolithic databases', 'Client-side rendering'], correct: 1, topic: 'Microservices', topicId: '3' },
  { text: 'Which HTTP method should be idempotent by standard?', options: ['POST', 'PUT', 'PATCH', 'None'], correct: 1, topic: 'API Design', topicId: '3' },
  { text: 'Which is an example of a popular Message Queue broker?', options: ['MongoDB', 'React', 'RabbitMQ', 'Nginx'], correct: 2, topic: 'Message Queues', topicId: '3' },
  { text: 'Which tool is industry-standard for monitoring time-series metrics?', options: ['Redis', 'Prometheus', 'Docker', 'Jenkins'], correct: 1, topic: 'Monitoring & Alerts', topicId: '3' },
  { text: 'What is the biggest tradeoff when implementing an architecture like Netflix?', options: ['Code readability vs Speed', 'Storage vs Bandwidth', 'Complexity vs Scalability', 'Security vs Profit'], correct: 2, topic: 'Case Studies', topicId: '3' },
  
  // Course 4: Web Fundamentals
  { text: 'Which HTML element is used to specify a header for a document or section?', options: ['<head>', '<header>', '<top>', '<heading>'], correct: 1, topic: 'HTML Semantics', topicId: '4' },
  { text: 'In CSS Grid, which property is used to set the number of columns?', options: ['grid-columns', 'grid-template-columns', 'grid-auto-flow', 'column-count'], correct: 1, topic: 'CSS Flexbox & Grid', topicId: '4' },
  { text: 'Which viewport meta tag property is crucial for responsive web design?', options: ['maximum-scale', 'width=device-width', 'user-scalable', 'shrink-to-fit'], correct: 1, topic: 'Responsive Design', topicId: '4' },
  { text: 'What does the "aria" in ARIA attributes stand for?', options: ['Accessible Rich Internet Applications', 'Advanced Reader Internet Attributes', 'Accessible Read Interpretation API', 'Authoritative Rich Interaction Area'], correct: 0, topic: 'Accessibility (a11y)', topicId: '4' },
  { text: 'Which storage API persists data even after the browser is closed?', options: ['Session Storage', 'Cookies', 'Local Storage', 'IndexedDB'], correct: 2, topic: 'Browser Storage', topicId: '4' },
  { text: 'What type of token is typically used in modern web authentication?', options: ['JWT', 'CSFR Token', 'CORS Token', 'XSS Token'], correct: 0, topic: 'Authentication Basics', topicId: '4' },
  { text: 'Which HTTP method should be used to update a resource completely?', options: ['GET', 'POST', 'PUT', 'PATCH'], correct: 2, topic: 'RESTful APIs', topicId: '4' },
  { text: 'What does "TTFB" measure in web performance?', options: ['Time To First Byte', 'Total Transfer Failed Bytes', 'Time To Frame Buffering', 'Total Time For Browsing'], correct: 0, topic: 'Web Performance', topicId: '4' },
  { text: 'What does SEO stand for?', options: ['Search Engine Optimization', 'Site Enhancement Options', 'Search Evaluation Organizer', 'Standard Experience Optimization'], correct: 0, topic: 'SEO Fundamentals', topicId: '4' },
  { text: "What security attack tries to execute malicious scripts in the victim's browser?", options: ['CSRF', 'XSS', 'DDoS', 'SQL Injection'], correct: 1, topic: 'Web Security Practices', topicId: '4' },

  // Course 5: Database Design
  { text: 'Which type of DB is often best suited for unstructured JSON data?', options: ['Relational DB', 'Document Store', 'Graph DB', 'Time-series DB'], correct: 1, topic: 'Relational vs NoSQL', topicId: '5' },
  { text: 'In ACID properties, what does "I" stand for?', options: ['Indexing', 'Integration', 'Isolation', 'Iteration'], correct: 2, topic: 'ACID Properties', topicId: '5' },
  { text: 'What is the primary goal of Database Normalization?', options: ['Reduce query times', 'Reduce data redundancy', 'Improve indexing speed', 'Encrypt data fields'], correct: 1, topic: 'Normalization Forms', topicId: '5' },
  { text: 'Which data structure is frequently used behind database indexes?', options: ['Linked List', 'B-Tree', 'Hash Table', 'Stack'], correct: 1, topic: 'Indexes & Performance', topicId: '5' },
  { text: 'Which JOIN returns all rows from the left table, and matching rows from the right table?', options: ['INNER JOIN', 'RIGHT JOIN', 'LEFT JOIN', 'FULL JOIN'], correct: 2, topic: 'Joins & Subqueries', topicId: '5' },
  { text: 'What SQL command rolls back a transaction if something fails?', options: ['REVERT', 'ROLLBACK', 'UNDO', 'CANCEL'], correct: 1, topic: 'Transactions', topicId: '5' },
  { text: 'What does Connection Pooling do?', options: ['Encrypts connections', 'Keeps open database connections in memory to reuse', 'Limits the number of users to 10', 'Merges columns'], correct: 1, topic: 'Connection Pooling', topicId: '5' },
  { text: 'What is the standard name for the primary server in a replication setup?', options: ['Master/Primary', 'Follower/Secondary', 'Replica', 'Shard'], correct: 0, topic: 'Replication Basics', topicId: '5' },
  { text: 'What is a Foreign Key?', options: ['A key used for encryption', 'A primary key in the same table', 'A field linking to a primary key of another table', 'A key generated randomly'], correct: 2, topic: 'Data Modeling', topicId: '5' },
  { text: 'Which of the following is an example of a Graph Database?', options: ['Cassandra', 'MongoDB', 'Neo4j', 'Redis'], correct: 2, topic: 'Graph Databases', topicId: '5' },

  // Course 6: Python for Data Science
  { text: 'Which library is primarily used for multi-dimensional mathematical arrays in Python?', options: ['Pandas', 'NumPy', 'Math', 'Matplotlib'], correct: 1, topic: 'NumPy Arrays', topicId: '6' },
  { text: 'What is the standard data structure used by Pandas?', options: ['Dictionary', 'DataFrame', 'LinkedList', 'Set'], correct: 1, topic: 'Pandas DataFrames', topicId: '6' },
  { text: 'Which built-in Python function is used to create a sequence of numbers?', options: ['sequence()', 'loop()', 'range()', 'list()'], correct: 2, topic: 'Python Syntax Basics', topicId: '6' },
  { text: 'What method in Pandas is used to handle missing data by dropping rows?', options: ['dropna()', 'fillna()', 'del()', 'remove()'], correct: 0, topic: 'Data Cleaning', topicId: '6' },
  { text: 'Which library makes it easiest to plot a statistical heatmap?', options: ['Matplotlib', 'Keras', 'Seaborn', 'BeautifulSoup'], correct: 2, topic: 'Matplotlib & Seaborn', topicId: '6' },
  { text: 'Which Scikit-Learn module contains machine learning algorithms?', options: ['sklearn.math', 'sklearn.plot', 'sklearn.metrics', 'sklearn.linear_model'], correct: 3, topic: 'Scikit-Learn Basics', topicId: '6' },
  { text: 'Linear Regression is used to predict what type of output?', options: ['Categorical classes', 'Continuous numeric values', 'True/False booleans', 'Strings'], correct: 1, topic: 'Linear Regression', topicId: '6' },
  { text: 'Despite its name, Logistic Regression is used for what kind of tasks?', options: ['Classification', 'Regression', 'Clustering', 'Dimensionality Reduction'], correct: 0, topic: 'Logistic Regression', topicId: '6' },
  { text: 'Which problem affects Decision Trees most often?', options: ['Underfitting', 'Slow training time', 'Overfitting', 'High memory usage'], correct: 2, topic: 'Decision Trees', topicId: '6' },
  { text: 'Which metric measures the percentage of correct predictions?', options: ['Recall', 'Accuracy', 'Precision', 'F1 Score'], correct: 1, topic: 'Model Evaluation', topicId: '6' },

  // Course 7: React.js Essentials
  { text: 'What syntax extension allows writing HTML inside JavaScript?', options: ['JSX', 'HTMLJS', 'Babel', 'ReactHTML'], correct: 0, topic: 'JSX & Components', topicId: '7' },
  { text: 'How do you pass data from a parent component to a child in React?', options: ['State', 'Props', 'Context', 'Refs'], correct: 1, topic: 'Props & State', topicId: '7' },
  { text: 'Which method was used in legacy React class components before unmounting?', options: ['componentWillUnmount', 'componentDidMount', 'componentDidUpdate', 'onUnmount'], correct: 0, topic: 'Component Lifecycle', topicId: '7' },
  { text: 'Which Hook allows you to add state to a functional component?', options: ['useEffect', 'useContext', 'useState', 'useReducer'], correct: 2, topic: 'React Hooks (useState)', topicId: '7' },
  { text: 'What second array parameter ensures useEffect only runs once?', options: ['[1]', '[null]', '[]', '[true]'], correct: 2, topic: 'React Hooks (useEffect)', topicId: '7' },
  { text: 'How do you prevent default form submission in React?', options: ['return false', 'e.preventDefault()', 'e.stopPropagation()', 'e.stopDefault()'], correct: 1, topic: 'Handling Events', topicId: '7' },
  { text: 'What React feature helps avoid prop-drilling?', options: ['Redux', 'Context API', 'useEffect', 'Fragments'], correct: 1, topic: 'Context API', topicId: '7' },
  { text: 'Which hook retrieves URL parameters in React Router?', options: ['useURL', 'useHistory', 'useParams', 'useNavigate'], correct: 2, topic: 'React Router', topicId: '7' },
  { text: 'What attribute controls the value of a controlled input in React?', options: ['defaultValue', 'initialValue', 'value', 'stateValue'], correct: 2, topic: 'Form Handling', topicId: '7' },
  { text: 'Which function prevents a component from re-rendering unless its props change?', options: ['React.memo', 'React.pure', 'React.freeze', 'React.stop'], correct: 0, topic: 'Performance Optimization', topicId: '7' },

  // Course 8: DevOps & Deployment
  { text: 'What command lists all files including hidden ones in Linux?', options: ['ls -h', 'ls -a', 'dir', 'list --all'], correct: 1, topic: 'Linux Command Line', topicId: '8' },
  { text: 'What file extension is common for Bash scripts?', options: ['.bat', '.sh', '.bash', '.cmd'], correct: 1, topic: 'Bash Scripting', topicId: '8' },
  { text: 'Which Git command saves changes locally to your repository?', options: ['git push', 'git add', 'git commit', 'git save'], correct: 2, topic: 'Git & GitHub', topicId: '8' },
  { text: 'What isolates an application and its dependencies into a single deployable unit?', options: ['VM', 'Docker Container', 'Vagrant', 'Hypervisor'], correct: 1, topic: 'Docker Containers', topicId: '8' },
  { text: 'Which file defines a multi-container Docker application?', options: ['Dockerfile', 'docker.ini', 'docker-compose.yml', 'docker.config'], correct: 2, topic: 'Docker Compose', topicId: '8' },
  { text: 'What triggers a GitHub Actions pipeline?', options: ['AWS', 'Workflows', 'Push Events', 'Docker'], correct: 2, topic: 'CI/CD Pipelines (GitHub Actions)', topicId: '8' },
  { text: 'What AWS service provides raw virtual servers (compute)?', options: ['S3', 'Lambda', 'EC2', 'RDS'], correct: 2, topic: 'AWS Basics (EC2 & S3)', topicId: '8' },
  { text: 'What is Nginx primarily used as in modern deployments?', options: ['Database', 'Message Queue', 'Reverse Proxy', 'Operating System'], correct: 2, topic: 'Nginx & Reverse Proxies', topicId: '8' },
  { text: 'In Kubernetes, what is the smallest deployable computing unit?', options: ['Node', 'Pod', 'Cluster', 'Container'], correct: 1, topic: 'Kubernetes Architecture', topicId: '8' },
  { text: 'Which tool is declaratively used for Infrastructure as Code across multiple clouds?', options: ['Ansible', 'Chef', 'Puppet', 'Terraform'], correct: 3, topic: 'Infrastructure as Code (Terraform)', topicId: '8' },

  // Course 9: Computer Networks
  { text: 'Which layer of the OSI model handles routing?', options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Physical Layer'], correct: 1, topic: 'OSI Model', topicId: '9' },
  { text: 'What is the main difference between TCP and UDP?', options: ['TCP is connectionless, UDP is connection-oriented', 'TCP is connection-oriented, UDP is connectionless', 'Both are connectionless', 'Both are connection-oriented'], correct: 1, topic: 'Transport Layer (TCP/UDP)', topicId: '9' },
  { text: 'Which protocol translates domain names to IP addresses?', options: ['DHCP', 'ARP', 'DNS', 'HTTP'], correct: 2, topic: 'DNS & DHCP', topicId: '9' },
  { text: 'Which class of IP address starts with the binary sequence 10?', options: ['Class A', 'Class B', 'Class C', 'Class D'], correct: 1, topic: 'IP Addressing', topicId: '9' },
  { text: 'Which of the following describes the BGP routing protocol?', options: ['Distance Vector', 'Link State', 'Path Vector', 'Hybrid'], correct: 2, topic: 'Routing Protocols', topicId: '9' },
  { text: 'What encapsulates data at the Data Link layer?', options: ['Packets', 'Segments', 'Frames', 'Bits'], correct: 2, topic: 'Network Topologies', topicId: '9' },
  { text: 'Which of the following encrypts network traffic at the Transport layer?', options: ['IPSec', 'TLS/SSL', 'WPA3', 'SSH'], correct: 1, topic: 'Network Security', topicId: '9' },
  { text: 'What does the CSMA/CA protocol stand for in wireless networking?', options: ['Carrier Sense Multiple Access with Collision Avoidance', 'Collision Sense Multiple Access with Collision Avoidance', 'Carrier Sense Multiple Access with Collision Alert', 'Carrier Sensing Multiple Access with Collision Affirmation'], correct: 0, topic: 'Wireless Networks', topicId: '9' },
  { text: 'Which application layer protocol is used for sending emails?', options: ['IMAP', 'POP3', 'SMTP', 'HTTP'], correct: 2, topic: 'Application Layer Protocols', topicId: '9' },
  { text: 'In a TCP/IP stack, which layer corresponds to the OSI Presentation layer?', options: ['Internet Layer', 'Application Layer', 'Transport Layer', 'Link Layer'], correct: 1, topic: 'TCP/IP', topicId: '9' },

  // Course 10: Operating Systems
  { text: 'What is a Process?', options: ['A program in execution', 'A block of memory', 'A thread', 'An I/O request'], correct: 0, topic: 'Processes & Threads', topicId: '10' },
  { text: 'Which scheduling algorithm is associated with time quantums?', options: ['FCFS', 'SJF', 'Round Robin', 'Priority'], correct: 2, topic: 'CPU Scheduling', topicId: '10' },
  { text: 'What problem does Paging solve in memory management?', options: ['Internal Fragmentation', 'External Fragmentation', 'Thrashing', 'Deadlocks'], correct: 1, topic: 'Memory Management', topicId: '10' },
  { text: 'What phenomenon occurs when a system spends more time paging than executing?', options: ['Deadlock', 'Starvation', 'Thrashing', 'Swapping'], correct: 2, topic: 'Virtual Memory', topicId: '10' },
  { text: 'Which of the following is a necessary condition for a deadlock?', options: ['Preemption', 'Hold and Wait', 'Shareable resources', 'Direct communication'], correct: 1, topic: 'Concurrency & Deadlocks', topicId: '10' },
  { text: 'What is the function of the inode in UNIX file systems?', options: ['Stores file data', 'Stores file metadata like permissions and blocks', 'Compiles the file', 'Manages memory'], correct: 1, topic: 'File Systems', topicId: '10' },
  { text: 'What does DMA (Direct Memory Access) do?', options: ['Bypasses the CPU for I/O transfers', 'Speeds up CPU calculations', 'Translates virtual addresses', 'Manages cache memory'], correct: 0, topic: 'I/O Systems', topicId: '10' },
  { text: 'What principle states that a process should have only the rights necessary to complete its task?', options: ['Principle of Least Privilege', 'Principle of Mutual Exclusion', 'Access Matrix Model', 'Capability-based System'], correct: 0, topic: 'Security & Protection', topicId: '10' },
  { text: 'In a distributed system, what handles synchronization without shared memory?', options: ['Semaphores', 'Message Passing', 'Monitors', 'Mutexes'], correct: 1, topic: 'Distributed Systems', topicId: '10' },
  { text: 'Which OS structure consists of small modules running in user space with a minimal kernel?', options: ['Monolithic Kernel', 'Microkernel', 'Layered OS', 'Modular OS'], correct: 1, topic: 'OS Structures', topicId: '10' },

  // Course 11: Computer Organization
  { text: 'What architectural model uses separate memory blocks for instructions and data?', options: ['Von Neumann', 'Harvard', 'RISC', 'CISC'], correct: 1, topic: 'Instruction Set Architecture', topicId: '11' },
  { text: 'What does an ALU primarily do?', options: ['Stores instructions', 'Controls data flow', 'Performs arithmetic and logical operations', 'Manages interrupts'], correct: 2, topic: 'ALUs & CPU Datapaths', topicId: '11' },
  { text: 'Which type of memory is the fastest but smallest in the memory hierarchy?', options: ['Main Memory', 'Registers', 'L1 Cache', 'Disk Storage'], correct: 1, topic: 'Memory Hierarchy & Cache', topicId: '11' },
  { text: 'What hazard in pipelining occurs when instructions need the result of a previous incomplete instruction?', options: ['Structural Hazard', 'Control Hazard', 'Data Hazard', 'Memory Hazard'], correct: 2, topic: 'Pipelining', topicId: '11' },
  { text: 'What technique predicts the outcome of a conditional branch to improve performance?', options: ['Register Renaming', 'Out-of-Order Execution', 'Branch Prediction', 'Superscalar Execution'], correct: 2, topic: 'Instruction Level Parallelism', topicId: '11' },
  { text: 'What mechanism alerts the CPU of an external event that requires immediate attention?', options: ['Polling', 'Interrupt', 'DMA', 'System Call'], correct: 1, topic: 'I/O & Interrupts', topicId: '11' },
  { text: 'What is stored in the Control Memory of a microprogrammed control unit?', options: ['User Programs', 'OS Kernel', 'Microinstructions', 'Cached Data'], correct: 2, topic: 'Microprogramming', topicId: '11' },
  { text: 'Which logic gate outputs 1 only if both inputs are 1?', options: ['OR', 'XOR', 'AND', 'NOR'], correct: 2, topic: 'Number Systems & Logic Gates', topicId: '11' },
  { text: 'What problem does cache coherence address in multicore architectures?', options: ['Paging faults', 'Inconsistent data in multiple local caches', 'Deadlocks', 'Pipeline stalls'], correct: 1, topic: 'Multicore Processors', topicId: '11' },
  { text: 'Which of the following is an example of an assembly language instruction type?', options: ['if-else block', 'Data Transfer (e.g., MOV)', 'Class Definition', 'SQL Query'], correct: 1, topic: 'Assembly Language Basics', topicId: '11' },

  // Course 12: Node.js Mastery
  { text: 'What engine does Node.js use under the hood?', options: ['SpiderMonkey', 'V8 Engine', 'Chakra', 'JavaScriptCore'], correct: 1, topic: 'Node.js Architecture', topicId: '12' },
  { text: 'Non-Blocking I/O means that:', options: ["A process doesn't wait for I/O to finish before moving on", 'Code execution is completely stopped', 'Files are read synchronously', 'Only one thread exists'], correct: 0, topic: 'Non-Blocking I/O', topicId: '12' },
  { text: 'What mechanism helps in dealing with asynchronous code after Callbacks?', options: ['Generators', 'Promises', 'Iterators', 'Loops'], correct: 1, topic: 'Callbacks & Promises', topicId: '12' },
  { text: 'Which phase of the Event Loop handles setTimeout callbacks?', options: ['Poll phase', 'Check phase', 'Timers phase', 'Close callbacks'], correct: 2, topic: 'Event Loop Deep Dive', topicId: '12' },
  { text: 'What is the standard module system originally used by Node.js?', options: ['ES6 Modules', 'CommonJS', 'AMD', 'UMD'], correct: 1, topic: 'Modules & CommonJS', topicId: '12' },
  { text: 'What file keeps track of exact versions of installed packages in npm?', options: ['package.json', 'npm-config.json', 'package-lock.json', 'modules.json'], correct: 2, topic: 'npm & Package Management', topicId: '12' },
  { text: 'In Node.js, what type of object allows you to read/write data continuously?', options: ['Buffer', 'Stream', 'Array', 'JSON'], correct: 1, topic: 'Streams & Buffers', topicId: '12' },
  { text: 'Which built-in module is used to create a web server?', options: ['server', 'web', 'net', 'http'], correct: 3, topic: 'HTTP Server Basics', topicId: '12' },
  { text: "Which method of the 'fs' module is synchronous?", options: ['readFile', 'readFileSync', 'readDir', 'readAll'], correct: 1, topic: 'File System (fs)', topicId: '12' },
  { text: 'What event should always be listened to on Streams to prevent crashes?', options: ['data', 'end', 'error', 'close'], correct: 2, topic: 'Error Handling in Node', topicId: '12' },

  // Course 13: Express.js Framework
  { text: 'Express.js is primarily considered a:', options: ['Database Engine', 'Web application framework for Node.js', 'Frontend library', 'Operating System'], correct: 1, topic: 'Express Basics', topicId: '13' },
  { text: 'What are middleware functions in Express?', options: ['Database triggers', 'Functions that have access to req, res, and next', 'Routing rules only', 'Static HTML files'], correct: 1, topic: 'Middleware Functions', topicId: '13' },
  { text: 'How do you define a route parameter in Express?', options: ['Using a question mark, like /user?id', 'Using a colon, like /user/:id', 'Using brackets, like /user/[id]', 'Using an asterisk, like /user/*'], correct: 1, topic: 'Routing', topicId: '13' },
  { text: 'How many arguments does an Error-Handling middleware take?', options: ['2', '3', '4', '5'], correct: 2, topic: 'Error Handling Middleware', topicId: '13' },
  { text: 'Which of the following is an example of a template engine often used with Express?', options: ['EJS', 'React', 'MongoDB', 'NGINX'], correct: 0, topic: 'Template Engines', topicId: '13' },
  { text: 'Which middleware helps secure your Express apps by setting various HTTP headers?', options: ['CORS', 'Passport', 'Helmet', 'Bcrypt'], correct: 2, topic: 'Express Security (Helmet)', topicId: '13' },
  { text: 'What built-in middleware parses incoming requests with JSON payloads?', options: ['express.json()', 'express.body()', 'express.bodyParser()', 'express.payload()'], correct: 0, topic: 'Body Parsing', topicId: '13' },
  { text: 'How do you serve static files like images efficiently in Express?', options: ['express.serve()', 'express.public()', 'express.static()', 'express.assets()'], correct: 2, topic: 'Static Files', topicId: '13' },
  { text: 'Why is Mongoose commonly used alongside Express and MongoDB?', options: ['It provides an Object Data Modeling (ODM) layer', 'It replaces MongoDB', 'It compiles HTML', 'It handles routing'], correct: 0, topic: 'Integration with Databases', topicId: '13' },
  { text: 'Which is considered a best practice in Express?', options: ['Hardcoding API keys', 'Running as root user', 'Always use environment variables for secrets', 'Synchronous file reading in routes'], correct: 2, topic: 'Express Best Practices', topicId: '13' },

  // Course 14: MongoDB Deep Dive
  { text: 'MongoDB stores data in what format?', options: ['Tabular tables', 'BSON documents', 'XML files', 'Key-Value pairs'], correct: 1, topic: 'Document Model vs Relational', topicId: '14' },
  { text: 'Which BSON type is used to store Document IDs?', options: ['String', 'Integer', 'ObjectId', 'UUID'], correct: 2, topic: 'BSON Types', topicId: '14' },
  { text: 'What command is used to insert multiple documents in MongoDB?', options: ['insertAll()', 'insertMany()', 'addMany()', 'bulkInsert()'], correct: 1, topic: 'CRUD Operations', topicId: '14' },
  { text: 'Which operator is used to check if a field exists?', options: ['\\$has', '\\$exists', '\\$present', '\\$is'], correct: 1, topic: 'Complex Queries ($or, $and)', topicId: '14' },
  { text: 'What is the primary purpose of an Index in MongoDB?', options: ['To encrypt data', 'To compress data', 'To support faster query execution', 'To link collections'], correct: 2, topic: 'Indexing Strategies', topicId: '14' },
  { text: 'Which pipeline stage is used to calculate aggregations over a group in MongoDB?', options: ['\\$match', '\\$sort', '\\$group', '\\$project'], correct: 2, topic: 'Aggregation Framework', topicId: '14' },
  { text: 'How does a Replica Set provide high availability?', options: ['By clustering CPUs', 'By maintaining multiple copies of data across different nodes', 'By caching to RAM', 'By deleting old logs'], correct: 1, topic: 'Replica Sets', topicId: '14' },
  { text: 'What is the process of storing data records across multiple machines called?', options: ['Replication', 'Sharding', 'Hashing', 'Indexing'], correct: 1, topic: 'Sharding', topicId: '14' },
  { text: 'Which MongoDB feature allows for storing large files exceeding BSON document size limits?', options: ['BlobFS', 'BigData', 'GridFS', 'MegaStore'], correct: 2, topic: 'GridFS', topicId: '14' },
  { text: 'What does Mongoose use to enforce structure on MongoDB documents?', options: ['Tables', 'Schemas', 'Views', 'Relations'], correct: 1, topic: 'Mongoose ODM Basics', topicId: '14' },

  // Course 15: AI & Machine Learning
  { text: 'What is the core difference between AI and ML?', options: ['AI is software, ML is hardware', 'AI is the broader concept of machines being smart, ML is machines explicitly learning from data', 'They are exactly the same thing', 'ML only uses neural networks'], correct: 1, topic: 'Intro to AI vs ML', topicId: '15' },
  { text: 'Which learning paradigm uses unlabeled data to find hidden structures?', options: ['Supervised Learning', 'Reinforcement Learning', 'Unsupervised Learning', 'Transfer Learning'], correct: 2, topic: 'Supervised vs Unsupervised', topicId: '15' },
  { text: 'What is the fundamental building block of a Neural Network called?', options: ['Axon', 'Synapse', 'Perceptron/Neuron', 'Node'], correct: 2, topic: 'Neural Networks Basics', topicId: '15' },
  { text: 'Deep Learning primarily relies upon what kind of architecture?', options: ['Linear Regression lines', 'Multi-layered artificial neural networks', 'Decision Trees', 'Support Vector Machines'], correct: 1, topic: 'Deep Learning Concepts', topicId: '15' },
  { text: 'Which field focuses on enabling computers to understand human language?', options: ['Computer Vision', 'Generative Design', 'Natural Language Processing', 'Big Data'], correct: 2, topic: 'Natural Language Processing', topicId: '15' },
  { text: 'Which of the following tasks is typically handled by Computer Vision?', options: ['Translating Spanish to English', 'Image Classification', 'Playing Chess', 'Predicting stock prices'], correct: 1, topic: 'Computer Vision', topicId: '15' },
  { text: 'What causes a machine learning model to be biased?', options: ['Too much RAM', 'Unrepresentative or prejudiced training data', 'Using Python', 'Fast GPUs'], correct: 1, topic: 'Model Bias & Fairness', topicId: '15' },
  { text: 'Why do we separate data into training and testing sets?', options: ['To save disk space', 'To encrypt the data', 'To evaluate the model on unseen data', 'Because the CPU gets hot'], correct: 2, topic: 'Training & Testing Splits', topicId: '15' },
  { text: 'What are hyperparameters?', options: ['Fast parameters', 'Configuration variables set before the learning process begins', 'Weights modified during training', 'Data labels'], correct: 1, topic: 'Hyperparameters', topicId: '15' },
  { text: 'What is a common way to expose an ML model to the web?', options: ['Mailing it', 'By wrapping it in a REST API', 'Printing the code', 'Using SQL'], correct: 1, topic: 'Deploying ML Models', topicId: '15' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/neurolearn');
    console.log('Connected to DB');

    await Course.deleteMany();
    await Question.deleteMany();
    console.log('Cleared collections');

    for (const c of courses) {
        let dc = { ...c };
        delete dc.progress;
        await Course.create(dc);
    }
    console.log('Seeded courses');

    for (const q of questions) {
        await Question.create(q);
    }
    console.log('Seeded questions');

    process.exit();
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

seed();
