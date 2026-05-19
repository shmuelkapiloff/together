const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    const htmlPath = path.join(__dirname, 'docs/guides/FINAL_PROJECT_BOOK_HE.html');
    const pdfPath = path.join(__dirname, 'docs/guides/FINAL_PROJECT_BOOK_HE.pdf');
    
    // Load the HTML file
    await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle2' });
    
    // Generate PDF
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      displayHeaderFooter: true,
      headerTemplate: '<div style="width:100%; text-align:right; font-size:10px; padding:10px;">ספר פרויקט גמר - Simple Shop</div>',
      footerTemplate: '<div style="width:100%; text-align:right; font-size:10px; padding:10px;"><span class="pageNumber"></span>/<span class="totalPages"></span></div>',
      printBackground: true
    });
    
    const stats = fs.statSync(pdfPath);
    console.log(`✓ PDF generated successfully!`);
    console.log(`  Path: ${pdfPath}`);
    console.log(`  Size: ${(stats.size / (1024*1024)).toFixed(2)} MB`);
    
    await browser.close();
  } catch (error) {
    console.error('✗ Error generating PDF:', error.message);
    process.exit(1);
  }
})();
