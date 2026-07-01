'use client';
import { useState } from 'react';
import { downloadReport } from '../lib/api';
export default function DownloadPdfButton({ path, filename, className = 'btn bg-gold text-coal' }) { const [error, setError] = useState(''); async function onClick() { setError(''); try { await downloadReport(path, filename); } catch (e) { setError(e.message); } } return <span className="inline-flex flex-col gap-1"><button type="button" onClick={onClick} className={className}>Télécharger PDF</button>{error && <small className="text-red-600">{error}</small>}</span>; }
