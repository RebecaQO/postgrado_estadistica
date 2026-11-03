/**
 * Helper utility to generate and download real, formatted institutional documents (PDF/HTML/Text)
 */

export const downloadDocument = (title, content, filename = "documento_umsa.txt") => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const printOrDownloadOfficialCertificate = (applicant) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Por favor permita las ventanas emergentes para generar su documento oficial.");
    return;
  }

  const isAdmitted = applicant.status === 'Habilitado / Admitido';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>UMSA - ${isAdmitted ? 'Carta de Aceptación Oficial' : 'Comprobante de Postulación'}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0f172a; margin: 40px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #003876; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { font-size: 20px; margin: 0; color: #003876; text-transform: uppercase; }
        .header h2 { font-size: 14px; margin: 5px 0 0 0; color: #f2681c; }
        .header h3 { font-size: 12px; margin: 3px 0 0 0; color: #64748b; font-weight: normal; }
        .ticket-code { font-family: monospace; font-size: 18px; color: #f2681c; font-weight: bold; background: #fff7ed; padding: 6px 12px; border: 1px dashed #f2681c; display: inline-block; margin-top: 10px; border-radius: 4px; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 25px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 13px; }
        .grid strong { color: #1e293b; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: bold; background: #dcfce7; color: #166534; }
        .footer { margin-top: 50px; border-top: 1px solid #cbd5e1; padding-top: 20px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #64748b; }
        .signature { text-align: center; width: 220px; border-top: 1px solid #0f172a; padding-top: 5px; font-size: 11px; }
        @media print {
          body { margin: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Universidad Mayor de San Andrés</h1>
        <h2>Facultad de Ciencias Puras y Naturales • Carrera de Estadística</h2>
        <h3>Unidad de Posgrado e Investigación — Gestión Académica 2026</h3>
        <div class="ticket-code">TICKET OFICIAL: ${applicant.ticketCode}</div>
      </div>

      <div class="card">
        <h3 style="margin-top:0; color:#003876;">${isAdmitted ? 'CARTA OFICIAL DE ADMISIÓN ACADÉMICA' : 'REGISTRO DE POSTULACIÓN DE POSGRADO'}</h3>
        <div class="grid">
          <div><strong>Postulante:</strong> ${applicant.fullName}</div>
          <div><strong>Cédula de Identidad:</strong> ${applicant.ci} ${applicant.ciExp || ''}</div>
          <div><strong>Programa:</strong> ${applicant.programTitle}</div>
          <div><strong>Modalidad Financiera:</strong> ${applicant.paymentOption}</div>
          <div><strong>Fecha de Emisión:</strong> ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <div><strong>Estado:</strong> <span class="badge">${applicant.status}</span></div>
        </div>
      </div>

      ${isAdmitted ? `
      <div style="font-size: 13px; text-align: justify; margin-bottom: 30px;">
        <p>Por la presente, la Dirección de Posgrado e Investigación de la Carrera de Estadística (FCPN - UMSA) certifica que el postulante ha cumplido a cabalidad con todos los requisitos académicos y legales estipulados por el Comité Ejecutivo de la Universidad Boliviana (CEUB), quedando <strong>HABILITADO Y ADMITIDO</strong> al programa respectivo.</p>
        <p><strong>Credenciales Provisorias de Campus:</strong> Usuario: <code>${applicant.acceptanceDetails?.campusUsername || applicant.ci}</code> | Matrícula: <code>${applicant.acceptanceDetails?.matriculaId || 'MAT-2026-0091'}</code></p>
      </div>
      ` : `
      <div style="font-size: 13px; text-align: justify; margin-bottom: 30px;">
        <p>El presente documento certifica la recepción y registro del expediente digital del postulante. El Comité de Admisión revisará la documentación cargada y publicará la resolución en la plataforma institucional.</p>
      </div>
      `}

      <div class="footer">
        <div>
          <div><strong>Firma Digital:</strong> ${applicant.acceptanceDetails?.digitalSignatureQr || 'SIG-UMSA-POS-2026'}</div>
          <div>Acreditación CEUB Res. HCU 142/2024</div>
          <div>Verificación: www.posgrado.estadistica.umsa.bo</div>
        </div>
        <div class="signature">
          <strong>M.Sc. Roxana Quisbert Valle</strong><br>
          Directora Unidad de Posgrado FCPN<br>
          Universidad Mayor de San Andrés
        </div>
      </div>

      <div class="no-print" style="margin-top: 30px; text-align: center;">
        <button onclick="window.print()" style="background:#f2681c; color:#fff; border:none; padding:10px 20px; font-size:14px; font-weight:bold; border-radius:6px; cursor:pointer;">
          🖨️ Imprimir / Guardar como PDF
        </button>
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
