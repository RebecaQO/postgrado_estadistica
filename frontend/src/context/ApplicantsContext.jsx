import React, { createContext, useContext, useState, useEffect } from 'react';

const ApplicantsContext = createContext();

const INITIAL_APPLICANTS = [
  {
    id: "app-101",
    ticketCode: "UMSA-EST-2026-0842",
    fullName: "Lic. Javier Fernando Condori Nina",
    ci: "8472910",
    ciExp: "LP",
    email: "javier.condori@gmail.com",
    phone: "+591 76543210",
    city: "La Paz",
    university: "Universidad Mayor de San Andrés",
    undergraduateDegree: "Licenciatura en Estadística",
    graduationYear: "2023",
    programId: "msc-ciencia-datos",
    programTitle: "Maestría en Estadística Aplicada y Ciencia de Datos",
    paymentOption: "Plan en Cuotas (18 Cuotas)",
    applicationDate: "2026-02-15T14:30:00Z",
    status: "Habilitado / Admitido", // 'En Revisión Documental' | 'Observado' | 'Habilitado / Admitido' | 'Rechazado'
    score: 94,
    documents: [
      { name: "Título en Provisión Nacional", status: "Aprobado", fileName: "Titulo_JavierCondori.pdf" },
      { name: "Diploma Académico", status: "Aprobado", fileName: "Diploma_JavierCondori.pdf" },
      { name: "Cédula de Identidad Anverso y Reverso", status: "Aprobado", fileName: "CI_JavierCondori.pdf" },
      { name: "Hoja de Vida Documentada", status: "Aprobado", fileName: "CV_JavierCondori.pdf" },
      { name: "Comprobante de Depósito de Postulación", status: "Aprobado", fileName: "Comprobante_Pago.pdf" }
    ],
    acceptanceDetails: {
      admissionNumber: "ADM-2026-EST-019",
      dateApproved: "20 de Febrero, 2026",
      digitalSignatureQr: "QR-SIG-FCPN-2026-VALID",
      matriculaId: "MAT-2026-0091",
      campusUsername: "jcondori.est",
      initialPass: "Estadistica2026*"
    }
  },
  {
    id: "app-102",
    ticketCode: "UMSA-EST-2026-0843",
    fullName: "Ing. Gabriela Morales Arteaga",
    ci: "6834921",
    ciExp: "CBBA",
    email: "gabriela.morales@outlook.com",
    phone: "+591 71239845",
    city: "Cochabamba",
    university: "Universidad Mayor de San Simón",
    undergraduateDegree: "Ingeniería de Sistemas",
    graduationYear: "2022",
    programId: "dip-machine-learning",
    programTitle: "Diplomado en Machine Learning y Modelos Estadísticos Avanzados",
    paymentOption: "Pago al Contado (Con Descuento)",
    applicationDate: "2026-02-18T10:15:00Z",
    status: "Observado",
    observations: "El archivo del Diploma Académico adjunto se encuentra ilegible o sin sello de autenticidad. Favor de volver a escanear en alta resolución (300 DPI) y subirlo nuevamente.",
    documents: [
      { name: "Título en Provisión Nacional", status: "Aprobado", fileName: "Titulo_GMorales.pdf" },
      { name: "Diploma Académico", status: "Observado", fileName: "Diploma_Ilegible.pdf" },
      { name: "Cédula de Identidad", status: "Aprobado", fileName: "CI_GMorales.pdf" },
      { name: "Hoja de Vida", status: "Aprobado", fileName: "CV_GMorales.pdf" }
    ]
  },
  {
    id: "app-103",
    ticketCode: "UMSA-EST-2026-0844",
    fullName: "Dra. Silvana Patricia Rios Calvimontes",
    ci: "4920193",
    ciExp: "SCZ",
    email: "silvana.rios@hospital.bo",
    phone: "+591 78901234",
    city: "Santa Cruz de la Sierra",
    university: "Universidad Gabriel René Moreno",
    undergraduateDegree: "Medicina Humana",
    graduationYear: "2021",
    programId: "msc-bioestadistica",
    programTitle: "Maestría en Bioestadística y Modelamiento Epidemiológico",
    paymentOption: "Plan en Cuotas",
    applicationDate: "2026-02-22T16:40:00Z",
    status: "En Revisión Documental",
    documents: [
      { name: "Título en Provisión Nacional", status: "Pendiente", fileName: "Titulo_SilvanaRios.pdf" },
      { name: "Diploma Académico", status: "Pendiente", fileName: "Diploma_SilvanaRios.pdf" },
      { name: "Cédula de Identidad", status: "Pendiente", fileName: "CI_SilvanaRios.pdf" },
      { name: "Hoja de Vida", status: "Pendiente", fileName: "CV_SilvanaRios.pdf" }
    ]
  }
];

export const ApplicantsProvider = ({ children }) => {
  const [applicants, setApplicants] = useState(() => {
    const saved = localStorage.getItem('posgrado_umsa_applicants');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_APPLICANTS; }
    }
    return INITIAL_APPLICANTS;
  });

  useEffect(() => {
    localStorage.setItem('posgrado_umsa_applicants', JSON.stringify(applicants));
  }, [applicants]);

  const addApplicant = (formData) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newTicketCode = `UMSA-EST-2026-${randomSuffix}`;
    const newId = `app-${Date.now()}`;

    const newApplicant = {
      id: newId,
      ticketCode: newTicketCode,
      fullName: `${formData.nombres} ${formData.apellidos}`,
      ci: formData.ci.trim(),
      ciExp: formData.ciExp || "LP",
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      university: formData.university,
      undergraduateDegree: formData.undergraduateDegree,
      graduationYear: formData.graduationYear,
      programId: formData.programId,
      programTitle: formData.programTitle,
      paymentOption: formData.paymentOption,
      applicationDate: new Date().toISOString(),
      status: "En Revisión Documental",
      documents: [
        { name: "Título en Provisión Nacional", status: "Pendiente", fileName: formData.documents?.titulo || "Titulo_Provision.pdf" },
        { name: "Diploma Académico", status: "Pendiente", fileName: formData.documents?.diploma || "Diploma_Academico.pdf" },
        { name: "Cédula de Identidad", status: "Pendiente", fileName: formData.documents?.ci || "Cedula_Identidad.pdf" },
        { name: "Hoja de Vida Documentada", status: "Pendiente", fileName: formData.documents?.cv || "Curriculum_Vitae.pdf" },
        { name: "Boleta de Depósito / CPT", status: "Pendiente", fileName: formData.documents?.pago || "Comprobante_Pago.pdf" }
      ]
    };

    setApplicants(prev => [newApplicant, ...prev]);
    return newApplicant;
  };

  const updateApplicantStatus = (id, newStatus, observationText = "", score = null) => {
    setApplicants(prev => prev.map(app => {
      if (app.id !== id) return app;
      const updated = {
        ...app,
        status: newStatus,
        observations: newStatus === 'Observado' ? observationText : undefined,
        score: score !== null ? score : app.score
      };

      if (newStatus === 'Habilitado / Admitido' && !app.acceptanceDetails) {
        updated.acceptanceDetails = {
          admissionNumber: `ADM-2026-EST-${Math.floor(100 + Math.random() * 900)}`,
          dateApproved: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
          digitalSignatureQr: "QR-SIG-FCPN-2026-VALID",
          matriculaId: `MAT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          campusUsername: `${app.fullName.split(' ')[0].toLowerCase()}.${app.ci}`,
          initialPass: "Estadistica2026*"
        };
      }
      return updated;
    }));
  };

  const resubmitDocument = (id, documentName, fileName = "Documento_Subsanado_Corregido.pdf") => {
    setApplicants(prev => prev.map(app => {
      if (app.id !== id) return app;
      const updatedDocs = app.documents.map(doc => {
        if (doc.name.toLowerCase().includes(documentName.toLowerCase()) || doc.status === 'Observado') {
          return { ...doc, status: 'Subsanado / En Revisión', fileName };
        }
        return doc;
      });
      return {
        ...app,
        status: 'En Revisión Documental',
        observations: undefined,
        documents: updatedDocs
      };
    }));
  };

  const findApplicant = (searchQuery) => {
    if (!searchQuery) return null;
    const clean = searchQuery.trim().toLowerCase();
    return applicants.find(app => 
      app.ci.toLowerCase() === clean || 
      app.ticketCode.toLowerCase() === clean ||
      app.email.toLowerCase() === clean
    );
  };

  return (
    <ApplicantsContext.Provider
      value={{
        applicants,
        addApplicant,
        updateApplicantStatus,
        resubmitDocument,
        findApplicant
      }}
    >
      {children}
    </ApplicantsContext.Provider>
  );
};

export const useApplicants = () => useContext(ApplicantsContext);
