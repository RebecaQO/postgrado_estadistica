import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function AdminSectionHeader({ section = 'Administración', title, description, actions }) {
  return (
    <header className="adm-page-heading">
      <div>
        <div className="adm-breadcrumb">
          <span>{section}</span>
          <ChevronRight size={13} aria-hidden="true" />
          <span>{title}</span>
        </div>
        <h1 className="adm-page-title">{title}</h1>
        {description && <p className="adm-page-description">{description}</p>}
      </div>
      {actions && <div className="adm-page-actions">{actions}</div>}
    </header>
  );
}
