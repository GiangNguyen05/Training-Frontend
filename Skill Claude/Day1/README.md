# Skill authoring best practices

## Core principles

Concise is key

- Your Skill shares the context window with everything else Claude needs to know, including:
  - The system prompt
  - Conversation history
  - Other Skills' metadata
  - Your actual request
- Start up:
  - metadata(name and description) --> all Skills is pre-loaded --> later,
    Claude reads SKILL.md only when the Skill becomes relevant, and reads additional files only as needed
- Exam:
  - Good:
    Use pdfplumber for text extraction:
    ```python
    import pdfplumber
    with pdfplumber.open("file.pdf") as pdf:
     text = pdf.pages[0].extract_text()
    ```
  - Not:
    PDF (Portable Document Format) files are a common file format that contains
    text, images, and other content. To extract text from a PDF, you'll need to
    use a library. There are many libraries available for PDF processing, but
    pdfplumber is recommended because it's easy to use and handles most cases well.
    First, you'll need to install it using pip. Then you can use the code below...

## Set appropriate degrees of freedom (mức tự do)

- High freedom(hướng dẫn bằng văn bản)
  - Multiple approaches are valid
  - Decisions depend on context
  - Heuristics guide the approach
    Exam:
    1. Analyze the code structure and organization
    2. Check for potential bugs or edge cases
    3. Suggest improvements for readability and maintainability
    4. Verify adherence to project conventions
- Medium freedom(mã giả hoặc kịch bản có tham số)
  - A preferred pattern exists
  - Some variation is acceptable
  - Configuration affects behavior
    Exam:
    Use this template and customize as needed:
    ```python
    def generate_report(data, format="markdown", include_charts=True):
        # Process data
        # Generate output in specified format
        # Optionally include visualizations
    ```
- Low freedom(các tập lệnh cụ thể, ít hoặc không có tham số)
  - Operations are fragile and error-prone
  - Consistency is critical
  - A specific sequence must be followed
    Exam:
    Run exactly this script:
    `bash
python scripts/migrate.py --verify --backup
`
    Do not modify the command or add additional flags.

--> Given multiple options, Claude will intelligently choose the best one.

## Skill structure

    YAML Frontmatter: The SKILL.md frontmatter requires two fields:

    name:

    - Maximum 64 characters
    - Must contain only lowercase letters, numbers, and hyphens
    - Cannot contain XML tags
    - Cannot contain reserved words: "anthropic", "claude"

    description:

    - Must be non-empty
    - Maximum 1024 characters
    - Cannot contain XML tags
    - Should describe what the Skill does and when to use it

## Naming conventions

- Consider using gerund form (verb + -ing) for Skill names: clearly describes the activity or capability the Skill provides.
- Remember that the name field must use lowercase letters, numbers, and hyphens only
  --> Purpose:
  - Reference Skills in documentation and conversations
  - Understand what a Skill does at a glance
  - Organize and search through multiple Skills
  - Maintain a professional, cohesive skill library

## Writing effective descriptions

- Be specific and include key terms.
- Include both what the Skill does and specific triggers/contexts for when to use it.
- Each Skill has exactly one description field
- Exam:
  - PDF Processing skill:
    "description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction."
  - Excel Analysis skill:
    "description: Analyze Excel spreadsheets, create pivot tables, generate charts. Use when analyzing Excel files, spreadsheets, tabular data, or .xlsx files."
  - Git Commit Helper skill:
    " description: Generate descriptive commit messages by analyzing git diffs. Use when the user asks for help writing commit messages or reviewing staged changes."

## Progressive disclosure patterns

- Keep SKILL.md body under 500 lines for optimal performance
- Split content into separate files when approaching this limit
- Use the patterns below to organize instructions, code, and resources effectively

## Visual overview: From simple to complex

- The complete Skill directory structure
  pdf/
  ├── SKILL.md # Main instructions (loaded when triggered)
  ├── FORMS.md # Form-filling guide (loaded as needed)
  ├── reference.md # API reference (loaded as needed)
  ├── examples.md # Usage examples (loaded as needed)
  └── scripts/

  ├── analyze_form.py # Utility script (executed, not loaded)
  ├── fill_form.py # Form filling script
  └── validate.py # Validation script
  linkAll: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices#visual-overview-from-simple-to-complex

## Avoid deeply nested references

- Keep references "one level" deep from SKILL.md. All reference files should link directly from SKILL.md to ensure Claude reads complete files when needed.
- Exam:
  - NOT:
    # SKILL.md
    See [advanced.md](advanced.md)...
    # advanced.md
    See [details.md](details.md)...
    # details.md
    Here's the actual information...
  - GOOD:
    # SKILL.md
    **Basic usage**: [instructions in SKILL.md]
    **Advanced features**: See [advanced.md](advanced.md)
    **API reference**: See [reference.md](reference.md)
    **Examples**: See [examples.md](examples.md)

## Structure longer reference files with table of contents

- files longer than 100 lines -->include a table of contents at the top.
- Exam:
  # API Reference
  ## Contents
  - Authentication and setup
  - Core methods (create, read, update, delete)
  - Advanced features (batch operations, webhooks)
  - Error handling patterns
  - Code examples
  ## Authentication and setup
  ...
  ## Core methods
  ...

## Workflows and feedback loops

### Use workflows for complex tasks:

- Break complex operations into clear, sequential steps
- complex process:
  Provide a checklist that Claude can copy into the response --> mark when complete.

### Implement feedback loops

- Common pattern: Run validator → fix errors → repeat (cải thiện chất lượng đầu ra)

linkAll: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices#workflows-and-feedback-loops
