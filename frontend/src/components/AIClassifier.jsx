'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Scan, ShieldAlert, Heart, Info, ArrowRight } from 'lucide-react';

export default function AIClassifier({ onInjectReport }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanText, setScanText] = useState('Extract Species Analytics');
  const [results, setResults] = useState(null);
  
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewSrc(event.target.result);
        setResults(null);

        // Load image to paint on canvas
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerScan = () => {
    setScanning(true);
    let pct = 0;
    
    const interval = setInterval(() => {
      pct += 10;
      setScanText(`Running CNN Feature Sweep: ${pct}%`);
      
      if (pct >= 100) {
        clearInterval(interval);
        setScanning(false);
        setScanText('Scan Completed Successfully');
        
        // Mock prediction result
        const speciesChoices = [
          { name: 'Golden Eagle', scName: 'Aquila chrysaetos', risk: 'Medium', status: 'Least Concern', habitat: 'High Mountains / Cliffs', bio: 'Regal avian predator with large sharp wings.' },
          { name: 'American Black Bear', scName: 'Ursus americanus', risk: 'High', status: 'Least Concern', habitat: 'Forest Interface', bio: 'Clever omnivore prone to searching suburban refuse.' },
          { name: 'Green Sea Turtle', scName: 'Chelonia mydas', risk: 'Low', status: 'Endangered', habitat: 'Ocean shorelines', bio: 'Marine reptile vulnerable to ocean plastic nets.' }
        ];

        const match = speciesChoices[Math.floor(Math.random() * speciesChoices.length)];
        const confidence = (92 + Math.random() * 7).toFixed(2);
        
        setResults({
          ...match,
          confidence
        });

        // Paint target box
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 8;
          const boxW = canvas.width * 0.55;
          const boxH = canvas.height * 0.55;
          const boxX = (canvas.width - boxW) / 2;
          const boxY = (canvas.height - boxH) / 2;
          
          ctx.strokeRect(boxX, boxY, boxW, boxH);
          
          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 26px sans-serif';
          ctx.fillText(`${match.name} (${confidence}%)`, boxX + 15, boxY + 40);
        }
      }
    }, 200);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Upload Zone */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
        <h3 className="font-extrabold text-white text-lg mb-2">Wildlife Scanner</h3>
        
        <div 
          onClick={() => document.getElementById('ai-uploader-input').click()}
          className="flex-grow border-2 border-dashed border-white/10 hover:border-emerald-400/50 rounded-2xl p-6 text-center cursor-pointer transition-all bg-white/5 relative flex items-center justify-center min-h-[300px]"
        >
          <input 
            type="file" 
            id="ai-uploader-input" 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageChange}
          />
          
          {!previewSrc ? (
            <div className="space-y-3">
              <UploadCloud className="w-12 h-12 text-emerald-400 mx-auto" />
              <div className="text-sm font-bold text-white">Select Wildlife Photograph</div>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">Drop files here to process dynamic visual tensor models.</p>
            </div>
          ) : (
            <div className="relative w-full max-w-md mx-auto">
              <canvas ref={canvasRef} className="w-full rounded-xl object-contain bg-black/40 border border-white/10" />
              {scanning && <div className="scanner-laser absolute left-0 right-0" />}
            </div>
          )}
        </div>

        <button
          onClick={triggerScan}
          disabled={!previewSrc || scanning}
          className="w-full mt-4 py-3.5 bg-emerald-700 hover:bg-emerald-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
        >
          {scanning ? 'Running Neural Sweeps...' : scanText}
        </button>
      </div>

      {/* Diagnostics Panel */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
        <h3 className="font-extrabold text-white text-lg border-b border-white/10 pb-2">AI Diagnostics Panel</h3>
        
        {!results ? (
          <div className="text-center py-24 text-gray-500 text-sm">
            <Scan className="w-10 h-10 mx-auto mb-2 text-gray-600" />
            Upload wildlife snapshot to compile classification statistics.
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Taxonomy Sighting</div>
                <div className="text-lg font-black text-white">{results.name}</div>
                <div className="text-[10px] text-gray-400 italic">{results.scName}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Model Accuracy</div>
                <div className="text-xl font-black text-emerald-400">{results.confidence}%</div>
                <div className="w-full bg-navy rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${results.confidence}%` }}></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-2xl space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Hazard Risk Assessment
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-white text-[9px] font-black uppercase tracking-wider ${
                  results.risk === 'High' ? 'bg-red-600' : results.risk === 'Medium' ? 'bg-yellow-600' : 'bg-emerald-600'
                }`}>
                  {results.risk}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{results.bio}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/5">
                <strong className="text-gray-400">IUCN status:</strong> <span className="text-yellow-400 font-bold">{results.status}</span>
              </div>
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/5">
                <strong className="text-gray-400">Preferred Habitat:</strong> <span className="text-white font-bold">{results.habitat}</span>
              </div>
            </div>

            <button
              onClick={() => onInjectReport(results)}
              className="w-full py-3 bg-navy border border-emerald-400/30 hover:bg-forest/20 text-emerald-400 font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-2"
            >
              Inject Diagnostics into Emergency Form <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
