import React, { useState } from 'react';
import { 
  FolderLock, 
  UploadCloud, 
  Download, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Filter, 
  Trash2,
  FileCheck2,
  Plus
} from 'lucide-react';
import { DocumentFile } from '../types';

interface CoffreFortProps {
  documents: DocumentFile[];
  onUploadDocument: (newDoc: any) => void;
  onDeleteDocument: (id: string) => void;
  onNavigate: (screen: string) => void;
}

export default function CoffreFort({ documents, onUploadDocument, onDeleteDocument, onNavigate }: CoffreFortProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [dragOver, setDragOver] = useState(false);

  // Form mock uploads
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileCat, setUploadedFileCat] = useState<any>('Certificat VGP');

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'Tous' || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['Tous', 'Certificat VGP', 'Assurance', 'Carte Grise', 'Contrat de Vente'];

  const handleMockUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFileName) return;

    const newDoc: DocumentFile = {
      id: `doc-${Date.now()}`,
      name: uploadedFileName.endsWith('.pdf') ? uploadedFileName : `${uploadedFileName}.pdf`,
      category: uploadedFileCat,
      uploadDate: new Date().toISOString().split('T')[0],
      expiryDate: uploadedFileCat === 'Certificat VGP' ? '2027-01-02' : undefined,
      size: '1.2 MB',
      status: 'Valide',
      url: '#'
    };

    onUploadDocument(newDoc);
    setUploadedFileName('');
    alert('Fichier téléchargé et chiffré avec succès dans votre Coffre-fort DEL-web.');
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6" id="screen-coffre-fort">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="font-sans text-2xl font-black text-gray-950">Coffre-fort Documents d'Entreprise</h1>
          <p className="text-xs text-gray-500">Espace ultra-sécurisé conforme RGPD. Stockage certifié de vos rapports VGP, contrats signés et attestations.</p>
        </div>
      </div>

      {/* Grid: Upload Zone & Document Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Upload Zone */}
        <div className="lg:col-span-4 space-y-6">
          <div 
            className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all bg-white flex flex-col items-center justify-center ${
              dragOver ? 'border-amber-500 bg-amber-50/10' : 'border-gray-200 hover:border-amber-400'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              setUploadedFileName(e.dataTransfer.files[0]?.name || 'Document_Chantier.pdf');
            }}
          >
            <UploadCloud className="h-10 w-10 text-gray-400 mb-3" />
            <h4 className="text-xs font-bold text-gray-950">Glissez-déposez vos fichiers ici</h4>
            <p className="text-[10px] text-gray-400 mt-1">Formats acceptés : PDF, PNG, JPG (Max. 10 MB)</p>
            <span className="text-[10px] text-gray-400 block my-2">ou</span>
            <label className="rounded-lg bg-gray-100 hover:bg-amber-100 hover:text-amber-900 px-4 py-2 text-[10px] font-bold text-gray-700 cursor-pointer transition-colors">
              Parcourir vos fichiers
              <input 
                type="file" 
                className="hidden" 
                onChange={(e) => setUploadedFileName(e.target.files?.[0]?.name || '')} 
              />
            </label>
          </div>

          {uploadedFileName && (
            <form onSubmit={handleMockUpload} className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4 shadow-sm">
              <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Finaliser l'enregistrement</h5>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Nom du fichier</label>
                <input
                  type="text"
                  value={uploadedFileName}
                  onChange={(e) => setUploadedFileName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Catégorie documentaire</label>
                <select
                  value={uploadedFileCat}
                  onChange={(e) => setUploadedFileCat(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium focus:outline-none"
                >
                  <option value="Certificat VGP">Certificat VGP (Inspection réglementaire)</option>
                  <option value="Assurance">Assurance (Attestation RC / Flotte)</option>
                  <option value="Carte Grise">Carte Grise (Immatriculation)</option>
                  <option value="Contrat de Vente">Contrat de Vente / Facture d'Achat</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-gray-950 hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Chiffrer et Enregistrer
              </button>
            </form>
          )}

          {/* Safety alert badge */}
          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 space-y-2">
            <h5 className="text-xs font-bold text-rose-800 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Alerte de renouvellement VGP
            </h5>
            <p className="text-[11px] text-rose-700 leading-relaxed">
              Le certificat VGP de votre <span className="font-bold">Komatsu PC210LC-11</span> a expiré. Pensez à planifier un contrôle pour téléverser le nouveau rapport d'inspection dans cet espace.
            </p>
          </div>
        </div>

        {/* Right Side: Document Table List */}
        <div className="lg:col-span-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between border-b border-gray-100 pb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un document par nom..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-4 text-xs font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-md px-2 py-1 text-[10px] font-bold transition-all ${
                    selectedCategory === cat ? 'bg-amber-500 text-gray-950' : 'text-gray-500 hover:text-gray-950'
                  }`}
                >
                  {cat.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between py-4 hover:bg-gray-50/50 px-2 rounded-xl transition-colors">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-gray-100 p-2 text-gray-500">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-snug">{doc.name}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                      <span className="font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">{doc.category}</span>
                      <span>•</span>
                      <span>Importé le : {doc.uploadDate}</span>
                      {doc.expiryDate && (
                        <>
                          <span>•</span>
                          <span className={`font-semibold ${doc.status === 'Expiré' ? 'text-rose-600' : 'text-emerald-600'}`}>
                            Exp : {doc.expiryDate}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                    doc.status === 'Valide'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}>
                    {doc.status}
                  </span>

                  <button 
                    onClick={() => alert('Téléchargement du document chiffré')}
                    className="rounded-lg border border-gray-100 p-2 text-gray-500 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>

                  <button 
                    onClick={() => onDeleteDocument(doc.id)}
                    className="rounded-lg border border-gray-100 p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
