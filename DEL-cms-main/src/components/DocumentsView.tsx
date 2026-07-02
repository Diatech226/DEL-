import React, { useState, useRef } from 'react';
import { Document } from '../types';
import { 
  FileText, 
  Search, 
  Upload, 
  Check, 
  X, 
  FileCheck, 
  Download, 
  Clock, 
  AlertTriangle, 
  Trash2,
  FileSpreadsheet,
  FileImage
} from 'lucide-react';

interface DocumentsViewProps {
  documents: Document[];
  onAddDocument: (doc: Omit<Document, 'id' | 'uploadedAt'>) => void;
  onUpdateDocumentStatus: (id: string, status: Document['status']) => void;
  onDeleteDocument: (id: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onAddDocument,
  onUpdateDocumentStatus,
  onDeleteDocument
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) ||
                          doc.relatedTo.toLowerCase().includes(search.toLowerCase()) ||
                          doc.uploadedBy.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const uniqueTypes = Array.from(new Set(documents.map(d => d.type)));

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    // Determine the type based on name or simulate
    let docType: Document['type'] = 'Rapport technique';
    if (file.name.toLowerCase().includes('assurance')) docType = 'Assurance';
    if (file.name.toLowerCase().includes('permis') || file.name.toLowerCase().includes('caces')) docType = 'Permis opérateur';
    if (file.name.toLowerCase().includes('contrat') || file.name.toLowerCase().includes('bail')) docType = 'Contrat de bail';
    if (file.name.toLowerCase().includes('certificat')) docType = 'Certificat conformité';

    // Parse friendly size
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${(file.size / 1024).toFixed(0)} KB`;

    onAddDocument({
      name: file.name,
      type: docType,
      size: sizeStr,
      uploadedBy: 'Thomas Martin (Admin)',
      relatedTo: 'Général / Nouveau Matériel',
      status: 'En Validation'
    });
    alert(`Fichier "${file.name}" importé avec succès dans le coffre-fort d'exploitation.`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div id="documents-view" className="space-y-6">
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Coffre-fort Documentaire réglementaire ({documents.length})</h1>
          <p className="text-xs text-slate-500">Stockez et certifiez l'ensemble des polices d'assurance engins, conformités CE et habilitations d'opérateurs.</p>
        </div>
      </div>

      {/* Grid of File Upload drag area and search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (1/3): Usability Pattern drag and drop uploader */}
        <div className="space-y-4">
          <div 
            id="drag-drop-zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] ${
              isDragging 
                ? 'border-amber-500 bg-amber-50/50' 
                : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/50'
            }`}
          >
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            />
            <div className="p-3 bg-slate-100 rounded-full text-slate-600 mb-4">
              <Upload size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-800">Glissez-déposez un fichier réglementaire</p>
            <p className="text-slate-400 text-xs mt-1">ou cliquez pour parcourir vos disques locaux</p>
            <p className="text-[10px] text-slate-400 font-mono mt-4">Formats acceptés : PDF, DOCX, XLSX, PNG, JPG (Max 15MB)</p>
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-3.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-500 font-sans">Politique de certification</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Tous les documents importés par les locataires ou les techniciens sont déposés avec le statut <strong>En Validation</strong>. L'administrateur de la plateforme doit auditer les dates d'effet avant d'émettre le certificat d'exploitation de la machine.
            </p>
          </div>
        </div>

        {/* Right Column (2/3): Document grid register */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                id="search-docs-input"
                type="text"
                placeholder="Rechercher par nom de fichier, cible..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              id="filter-doc-type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-3 py-2 text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">Toutes les pièces jointes</option>
              {uniqueTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* List layout */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map(doc => (
                  <div key={doc.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                    
                    {/* Document Meta */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2.5 bg-slate-100 text-slate-600 rounded-lg shrink-0">
                        {doc.name.toLowerCase().endsWith('.xls') || doc.name.toLowerCase().endsWith('.xlsx') ? (
                          <FileSpreadsheet size={18} />
                        ) : doc.name.toLowerCase().endsWith('.png') || doc.name.toLowerCase().endsWith('.jpg') ? (
                          <FileImage size={18} />
                        ) : (
                          <FileText size={18} />
                        )}
                      </div>
                      
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-xs truncate" title={doc.name}>{doc.name}</p>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 mt-1 font-mono">
                          <span className="bg-slate-100 text-slate-700 font-sans font-semibold px-1.5 py-0.5 rounded text-[9px]">{doc.type}</span>
                          <span>•</span>
                          <span>Taille: {doc.size}</span>
                          <span>•</span>
                          <span>Déposé le : {doc.uploadedAt} par {doc.uploadedBy}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-semibold mt-1">Concerne : {doc.relatedTo}</p>
                      </div>
                    </div>

                    {/* Document Status and controls */}
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        doc.status === 'Valide' ? 'bg-emerald-100 text-emerald-800' :
                        doc.status === 'Expiré' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {doc.status}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => alert(`Téléchargement de l'archive documentaire : ${doc.name}`)}
                          className="p-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded cursor-pointer"
                          title="Télécharger le fichier original"
                        >
                          <Download size={12} />
                        </button>

                        {doc.status === 'En Validation' && (
                          <>
                            <button
                              onClick={() => {
                                onUpdateDocumentStatus(doc.id, 'Valide');
                                alert(`Le document "${doc.name}" a été officiellement VALIDÉ.`);
                              }}
                              className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded cursor-pointer"
                              title="Valider la conformité de la pièce"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              onClick={() => {
                                onUpdateDocumentStatus(doc.id, 'Expiré');
                                alert(`Le document "${doc.name}" a été REJETÉ.`);
                              }}
                              className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded cursor-pointer"
                              title="Déclarer la pièce comme invalide ou expirée"
                            >
                              <X size={12} />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => {
                            if (confirm(`Supprimer définitivement la pièce jointe ${doc.name} ?`)) {
                              onDeleteDocument(doc.id);
                            }
                          }}
                          className="p-1.5 border border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Supprimer du registre"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Aucune pièce jointe stockée pour cette recherche.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
