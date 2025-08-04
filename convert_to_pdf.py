#!/usr/bin/env python3
"""
Simple Markdown to PDF converter using weasyprint
"""

def convert_md_to_pdf():
    try:
        import markdown
        import weasyprint
        
        # Read markdown file
        with open('PROYECTO_DOCUMENTACION_COMPLETA.md', 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        # Convert markdown to HTML
        html = markdown.markdown(md_content, extensions=['codehilite', 'toc'])
        
        # Add CSS for better styling
        html_with_css = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Portfolio Documentation - Complete Guide</title>
            <style>
                @page {{
                    size: A4;
                    margin: 2cm;
                    @bottom-center {{
                        content: counter(page);
                    }}
                }}
                body {{
                    font-family: 'Georgia', 'Times New Roman', serif;
                    line-height: 1.6;
                    color: #333;
                    font-size: 11pt;
                }}
                h1 {{
                    color: #2e3440;
                    border-bottom: 3px solid #5e81ac;
                    padding-bottom: 10px;
                    page-break-before: always;
                    margin-top: 0;
                }}
                h1:first-child {{
                    page-break-before: avoid;
                }}
                h2 {{
                    color: #3b4252;
                    border-bottom: 2px solid #81a1c1;
                    padding-bottom: 5px;
                    page-break-after: avoid;
                }}
                h3 {{
                    color: #434c5e;
                    page-break-after: avoid;
                }}
                h4 {{
                    color: #4c566a;
                    page-break-after: avoid;
                }}
                code {{
                    background: #f8f9fa;
                    padding: 2px 4px;
                    border-radius: 3px;
                    font-family: 'Consolas', 'Monaco', monospace;
                    font-size: 9pt;
                }}
                pre {{
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    overflow-x: auto;
                    border-left: 4px solid #5e81ac;
                    font-size: 8pt;
                    line-height: 1.4;
                }}
                pre code {{
                    background: none;
                    padding: 0;
                }}
                blockquote {{
                    border-left: 4px solid #5e81ac;
                    margin: 0;
                    padding-left: 20px;
                    font-style: italic;
                }}
                table {{
                    border-collapse: collapse;
                    width: 100%;
                    margin: 15px 0;
                }}
                th, td {{
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }}
                th {{
                    background-color: #f2f2f2;
                    font-weight: bold;
                }}
                ul, ol {{
                    padding-left: 20px;
                }}
                li {{
                    margin-bottom: 5px;
                }}
                .toc {{
                    page-break-after: always;
                    border: 1px solid #ddd;
                    padding: 20px;
                    background: #f9f9f9;
                }}
            </style>
        </head>
        <body>
        {html}
        </body>
        </html>
        '''
        
        # Convert HTML to PDF
        weasyprint.HTML(string=html_with_css).write_pdf('PROYECTO_DOCUMENTACION_COMPLETA.pdf')
        print('PDF created successfully with weasyprint!')
        return True
        
    except ImportError as e:
        print(f'weasyprint not available: {e}')
        return False
    except Exception as e:
        print(f'Error: {e}')
        return False

def convert_md_to_html():
    """Fallback: Convert to HTML if PDF libraries not available"""
    try:
        import markdown
        
        # Read markdown file
        with open('PROYECTO_DOCUMENTACION_COMPLETA.md', 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        # Convert markdown to HTML
        html = markdown.markdown(md_content, extensions=['codehilite', 'toc'])
        
        # Add CSS for better styling
        html_with_css = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Portfolio Documentation - Complete Guide</title>
            <style>
                body {{
                    font-family: 'Georgia', 'Times New Roman', serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 40px;
                }}
                h1 {{
                    color: #2e3440;
                    border-bottom: 3px solid #5e81ac;
                    padding-bottom: 10px;
                }}
                h2 {{
                    color: #3b4252;
                    border-bottom: 2px solid #81a1c1;
                    padding-bottom: 5px;
                }}
                h3 {{
                    color: #434c5e;
                }}
                h4 {{
                    color: #4c566a;
                }}
                code {{
                    background: #f8f9fa;
                    padding: 2px 4px;
                    border-radius: 3px;
                    font-family: 'Consolas', 'Monaco', monospace;
                }}
                pre {{
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    overflow-x: auto;
                    border-left: 4px solid #5e81ac;
                }}
                pre code {{
                    background: none;
                    padding: 0;
                }}
                blockquote {{
                    border-left: 4px solid #5e81ac;
                    margin: 0;
                    padding-left: 20px;
                    font-style: italic;
                }}
                table {{
                    border-collapse: collapse;
                    width: 100%;
                    margin: 15px 0;
                }}
                th, td {{
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }}
                th {{
                    background-color: #f2f2f2;
                    font-weight: bold;
                }}
                @media print {{
                    body {{
                        font-size: 11pt;
                    }}
                    h1 {{
                        page-break-before: always;
                    }}
                    h1:first-child {{
                        page-break-before: avoid;
                    }}
                    h2, h3, h4 {{
                        page-break-after: avoid;
                    }}
                }}
            </style>
        </head>
        <body>
        {html}
        </body>
        </html>
        '''
        
        # Write HTML file
        with open('PROYECTO_DOCUMENTACION_COMPLETA.html', 'w', encoding='utf-8') as f:
            f.write(html_with_css)
        
        print('HTML file created successfully!')
        print('You can open it in a browser and print to PDF using Ctrl+P -> Save as PDF')
        return True
        
    except ImportError:
        print('markdown module not available')
        return False
    except Exception as e:
        print(f'Error: {e}')
        return False

if __name__ == '__main__':
    # Try PDF first, fallback to HTML
    if not convert_md_to_pdf():
        print('Falling back to HTML conversion...')
        convert_md_to_html()