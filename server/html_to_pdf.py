#!/usr/bin/env python3
import os
from weasyprint import HTML

# Define paths
current_dir = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(current_dir, "docs/guides/FINAL_PROJECT_BOOK_HE.html")
pdf_path = os.path.join(current_dir, "docs/guides/FINAL_PROJECT_BOOK_HE.pdf")

# Convert HTML to PDF
try:
    HTML(html_path).write_pdf(pdf_path)
    print(f"✓ PDF created successfully at: {pdf_path}")
    print(f"  File size: {os.path.getsize(pdf_path) / (1024*1024):.2f} MB")
except Exception as e:
    print(f"✗ Error creating PDF: {e}")
