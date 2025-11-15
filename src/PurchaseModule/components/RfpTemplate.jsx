

import { useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import templateBg from "../../assests/template.jpg";
import SoftTrailsLogo from "../../assests/SoftTrails.png";

export async function RfpTemplate(formData = {}) {
  const {
    rfpId = "ERY000012",
    organization = "Higher India Private Limited",
    address = "2/1 Rajpur road Survey Chowk, Dehradun. 248001",
    issueDate = "25 May 2025",
    title = "Project Title",
    description = "No additional description provided.",
    openDate = "25 May 2025",
    endDate = "25 June 2025",
    logoImg, // optional logo image (URL or base64)
  } = formData;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size (Page 1)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Background template
  const bgBytes = await fetch(templateBg).then((res) => res.arrayBuffer());
  const bgImage = await pdfDoc.embedJpg(bgBytes);
  page.drawImage(bgImage, {
    x: 0,
    y: 0,
    width: 595.28,
    height: 841.89,
  });

  const drawText = (text, x, y, size = 14, bold = false) => {
    page.drawText(text, {
      x,
      y,
      size,
      font: bold ? fontBold : fontRegular,
      color: rgb(0.1, 0.1, 0.1),
    });
  };

  // ========== HEADER ==========
  drawText(`RFP ID : ${rfpId}`, 30, 800, 14, true);

  // ========== ORGANIZATION DETAILS ==========
  drawText(organization, 40, 650, 14, true);

  // address (multi-line)
  const addressLines = address.split(/\n|,/).map((a) => a.trim()).filter(Boolean);
  let yPos = 630;
  addressLines.forEach((line) => {
    drawText(line, 40, yPos, 14);
    yPos -= 20;
  });

  // date below address
  drawText(issueDate, 40, yPos - 5, 14);

  // ========== TITLE ==========
  drawText("Request For Proposal (RFP)", 40, 460, 26, true);

  // Project Title
  drawText(title, 40, 400, 16, true);

  // ========== DESCRIPTION ==========
  const maxCharsPerLine = 55;
  const words = description.split(" ");
  const lines = [];
  let currentLine = "";
  for (const word of words) {
    const testLine = currentLine + (currentLine ? " " : "") + word;
    if (testLine.length > maxCharsPerLine && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  let descY = 370;
  lines.slice(0, 6).forEach((line) => {
    drawText(line, 40, descY, 14);
    descY -= 14;
  });

  // ========== FOOTER ==========
  drawText(`RFP open date : ${openDate}`, 40, 140, 14, true);
  drawText(`RFP end date : ${endDate}`, 40, 120, 14, true);

  // ========== LOGO (optional) ==========
  try {
    const logoBytes = await fetch(SoftTrailsLogo).then((res) => res.arrayBuffer());
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const pageWidth = page.getSize().width;
    const pageHeight = page.getSize().height;
    page.drawImage(logoImage, {
      x: pageWidth / 2 - 50, // center horizontally
      y: pageHeight - 100, // positioned in top-center area
      width: 100,
      height: 26.8,
    });
  } catch (err) {
    console.log("SoftTrails logo load failed:", err);
  }

  if (logoImg) {
    try {
      const imgBytes = await fetch(logoImg).then((res) => res.arrayBuffer());
      const img =
        logoImg.toLowerCase().endsWith(".png")
          ? await pdfDoc.embedPng(imgBytes)
          : await pdfDoc.embedJpg(imgBytes);
      const pageWidth = page.getSize().width;
      page.drawImage(img, {
        x: pageWidth - 390, // left of right gray line (approx)
        y: 720,
        width: 150,
        height: 40,
      });
    } catch (err) {
      console.log("Custom logo load failed:", err);
    }
  }

  // =====================
  // Page 2: Details table
  // =====================
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  const pw = page2.getSize().width;
  const ph = page2.getSize().height;
  const marginX = 40;
  let cursorY = ph - 80; // start below the top

  const black = rgb(0, 0, 0);
  const lightGray = rgb(0.9, 0.91, 0.93); // #E5E7EB-ish
  const headerBg = rgb(0.953, 0.957, 0.965); // #F3F4F6-ish
  const textDark = rgb(0.07, 0.07, 0.07); // #111827-ish
  const textMuted = rgb(0.42, 0.46, 0.50); // #6B7280-ish

  // Helpers
  const drawText2 = ({ text, x, y, size = 12, bold = false, color = textDark }) => {
    page2.drawText(String(text ?? ""), {
      x,
      y,
      size,
      font: bold ? fontBold : fontRegular,
      color,
    });
  };

  const drawRule = (x, y, width, height = 1, color = black) => {
    page2.drawRectangle({ x, y, width, height, color });
  };

  const wrapText = (text, font, size, maxWidth) => {
    const words = String(text || "").split(/\s+/);
    const lines = [];
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (font.widthOfTextAtSize(test, size) > maxWidth) {
        if (line) lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  // Top separator line
  drawRule(marginX, cursorY, pw - marginX * 2, 1, black);
  cursorY -= 30;

  // Meta two-column section
  const gapX = 40;
  const colW = (pw - marginX * 2 - gapX) / 2;
  // Resolve dynamic values (fall back to placeholders)
  const resolvedIndentId = formData?.indentId || formData?.id || "IND-2024-001";
  const resolvedRfpId = rfpId || formData?.rfpId || "ERY000012";

  // Left column
  drawText2({ text: "Indent ID", x: marginX, y: cursorY, size: 11, color: textMuted });
  drawText2({ text: resolvedIndentId, x: marginX, y: cursorY - 18, size: 12, bold: true, color: textDark });
  drawRule(marginX, cursorY - 22, colW, 1, lightGray);

  // Right column
  const rightX = marginX + colW + gapX;
  drawText2({ text: "RFP ID", x: rightX, y: cursorY, size: 11, color: textMuted });
  drawText2({ text: resolvedRfpId, x: rightX, y: cursorY - 18, size: 12, bold: true, color: textDark });
  drawRule(rightX, cursorY - 22, colW, 1, lightGray);

  // Move the materials section a bit further down to match the
  // reference screenshot spacing (large whitespace after meta block)
  const GAP_AFTER_META = 140; // was 80
  cursorY -= GAP_AFTER_META;

  // Section title
  drawText2({ text: "Material / Asset Details", x: marginX, y: cursorY, size: 14, bold: true });
  cursorY -= 18;

  // Table header
  const colFractions = [2.2, 0.8, 0.8, 2.0];
  const sumFrac = colFractions.reduce((a, b) => a + b, 0);
  const colWidths = colFractions.map((f) => ((pw - marginX * 2) * f) / sumFrac);
  const headers = ["Material / Asset Name", "Quantity", "UOM", "Description"];

  // Header background
  page2.drawRectangle({ x: marginX, y: cursorY - 20, width: pw - marginX * 2, height: 24, color: headerBg });

  let runningX = marginX;
  headers.forEach((h, i) => {
    drawText2({ text: h, x: runningX + 8, y: cursorY - 14, size: 11, bold: true, color: textDark });
    if (i < headers.length - 1) {
      // vertical separators optional; keeping table clean
    }
    runningX += colWidths[i];
  });
  cursorY -= 28; // move below header

  // Table rows from formData.productItems / items
  const productItems = formData?.productItems || formData?.items || [];
  const rows = Array.isArray(productItems) && productItems.length > 0 ? productItems : [];

  const lineHeight = 12 * 1.35;
  const textSize = 12;

  // Note: For simplicity, this version does not paginate rows beyond one page.

  // Draw each row
  rows.forEach((row) => {
    const name = row.product_name || row.asset_name || row.name || "-";
    const qty = row.quantity ?? row.qty ?? "-";
    const uom = row.uom || row.unit || "-";
    const desc = row.description || row.spec || "";

    // Wrap description
    const descMax = colWidths[3] - 16;
    const descLines = wrapText(desc, fontRegular, textSize, descMax);
    const rowHeight = Math.max(lineHeight, descLines.length * lineHeight);

    // Horizontal rule above the row
    drawRule(marginX, cursorY - rowHeight - 4, pw - marginX * 2, 1, lightGray);

    // Name
    drawText2({ text: name, x: marginX + 8, y: cursorY - lineHeight, size: textSize, color: textDark });
    // Quantity
    drawText2({ text: String(qty), x: marginX + colWidths[0] + 8, y: cursorY - lineHeight, size: textSize, color: textDark });
    // UOM
    drawText2({ text: String(uom), x: marginX + colWidths[0] + colWidths[1] + 8, y: cursorY - lineHeight, size: textSize, color: textDark });
    // Description (multi-line)
    let dy = 0;
    descLines.forEach((ln) => {
      drawText2({ text: ln, x: marginX + colWidths[0] + colWidths[1] + colWidths[2] + 8, y: cursorY - lineHeight - dy, size: textSize, color: textMuted });
      dy += lineHeight;
    });

    cursorY -= rowHeight + 12;
  });

  // If no rows, draw an empty line placeholder
  if (!rows.length) {
    drawRule(marginX, cursorY - 18, pw - marginX * 2, 1, lightGray);
    drawText2({ text: "No items provided", x: marginX + 8, y: cursorY - 14, size: 12, color: textMuted });
  }

  // ========== OUTPUT ==========
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const file = new File([blob], `RFP_${rfpId}.pdf`, { type: "application/pdf" });
  return file;
}

// Provide a named export that other modules can import
export async function generateRfpPdf(formData = {}) {
  // RfpTemplate already returns a File object
  return await RfpTemplate(formData);
}

const RfpGenerator = ({ formData = {}, onFileGenerated }) => {
  useEffect(() => {
    const create = async () => {
      const file = await generateRfpPdf(formData);
      if (onFileGenerated) onFileGenerated(file);
    };
    create();
  }, [formData, onFileGenerated]);

  return null;
};

export default RfpTemplate;
