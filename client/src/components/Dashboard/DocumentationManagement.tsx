import React, { useState, useEffect } from 'react';
import { getDocumentations, createDocumentation, deleteDocumentation } from '../../api/api';

interface Documentation {
  _id: string;
  title: string;
  date: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  points: string[];
}

export const DocumentationManagement: React.FC<{ token: string }> = ({ token }) => {
  const [docs, setDocs] = useState<Documentation[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [pointsInput, setPointsInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await getDocumentations();
      if (res.success) {
        setDocs(res.data);
      }
    } catch (err) {
      console.error('Error fetching docs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    
    setUploading(true);
    const points = pointsInput.split('\n').filter(p => p.trim() !== '');
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('date', date);
    formData.append('points', JSON.stringify(points));
    formData.append('file', file);

    try {
      const res = await createDocumentation(token, formData);
      if (res.success) {
        setTitle('');
        setDate('');
        setFile(null);
        setPointsInput('');
        
        // Reset file input element
        const fileInput = document.getElementById('doc-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        fetchDocs();
      }
    } catch (err) {
      console.error('Error creating doc', err);
      alert('Failed to upload documentation');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      const res = await deleteDocumentation(token, id);
      if (res.success) fetchDocs();
    } catch (err) {
      console.error('Error deleting doc', err);
      alert('Failed to delete documentation');
    }
  };

  return (
    <div className="surface" style={{ padding: '32px', marginTop: '32px' }}>
      <h2>📚 Documentation Management</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '24px' }}>
        
        {/* Create Form */}
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--color-bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-border-subtle)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Title</label>
            <input 
              required 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g. Analysis of MERN Architecture"
              style={{ width: '100%', padding: '14px', background: 'var(--color-bg)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text)', borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Date</label>
            <input 
              required 
              type="text" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              placeholder="e.g. Jan 2026"
              style={{ width: '100%', padding: '14px', background: 'var(--color-bg)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text)', borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Document File (.pdf, .doc, .docx)</label>
            <input 
              id="doc-file-input"
              required 
              type="file" 
              accept=".pdf,.doc,.docx"
              onChange={e => setFile(e.target.files ? e.target.files[0] : null)} 
              style={{ width: '100%', padding: '12px', background: 'var(--color-bg)', border: '1px dashed var(--color-primary)', color: 'var(--color-text)', borderRadius: '8px', cursor: 'pointer' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Key Points (One per line)</label>
            <textarea 
              value={pointsInput} 
              onChange={e => setPointsInput(e.target.value)} 
              rows={5}
              placeholder="Point 1&#10;Point 2&#10;Point 3"
              style={{ width: '100%', padding: '14px', background: 'var(--color-bg)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text)', borderRadius: '8px', resize: 'vertical', outline: 'none' }}
            />
          </div>
          <button type="submit" disabled={uploading} className="btn btn--primary" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? <div style={{ color: 'var(--color-text-muted)' }}>Loading documents...</div> : docs.map(doc => (
            <div key={doc._id} style={{ padding: '20px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', transition: 'transform 0.2s ease', cursor: 'default' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--color-text)' }}>{doc.title}</h4>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>{doc.date}</div>
                <div style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'var(--color-bg)', borderRadius: '4px', display: 'inline-block', border: '1px solid var(--color-border-subtle)' }}>
                  📄 {doc.fileName}
                </div>
              </div>
              <button onClick={() => handleDelete(doc._id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', alignSelf: 'center', fontWeight: 600, transition: 'all 0.2s ease' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}>
                Delete
              </button>
            </div>
          ))}
          {docs.length === 0 && !loading && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', borderRadius: '12px', border: '1px dashed var(--color-border-subtle)' }}>
              No documents uploaded yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
