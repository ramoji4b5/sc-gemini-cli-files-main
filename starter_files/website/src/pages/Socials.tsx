
import { Download } from 'lucide-react';

export const Socials = () => {
  const fonts = {
    heading: 'font-sans', 
    body: 'font-sans',
  };

  const colors = {
    primary: [
      { name: 'Primary-600', hex: '#6366f1' },
      { name: 'Primary-400', hex: '#818cf8' },
    ],
    secondary: [
      { name: 'Secondary-600', hex: '#e11d48' },
      { name: 'Secondary-400', hex: '#fb7185' },
    ],
    neutral: [
      { name: 'Slate-950', hex: '#020617' },
      { name: 'Slate-800', hex: '#1e293b' },
      { name: 'Slate-400', hex: '#94a3b8' },
      { name: 'Slate-50', hex: '#f8fafc' },
    ],
  };

  const socialTag = '@TechStackConf';

  const assets = [
    { name: 'Logo SVG', path: '/logo.svg', preview: '/logo.svg' },
  ];

  const ColorPalette = ({ title, colorList }) => (
    <div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {colorList.map((color) => (
          <div key={color.name} className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
            <div className="w-full h-16 rounded" style={{ backgroundColor: color.hex }}></div>
            <div className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">{color.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{color.hex}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">Social Media Kit</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Promote your presence at TechStack Conference 2026!</p>
      </div>

      <div className="space-y-12">
        {/* Social Tag */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Official Social Tag</h2>
          <div className="p-6 rounded-lg bg-slate-100 dark:bg-slate-800">
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{socialTag}</p>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Use this tag when posting about the conference on social media.</p>
          </div>
        </div>

        {/* Fonts */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Fonts</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg bg-slate-100 dark:bg-slate-800">
              <h3 className={`${fonts.heading} text-2xl font-bold text-slate-800 dark:text-slate-200`}>Heading Font</h3>
              <p className="mt-2 text-5xl font-bold text-slate-900 dark:text-white">Aa</p>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Used for titles and headlines.</p>
            </div>
            <div className="p-6 rounded-lg bg-slate-100 dark:bg-slate-800">
              <h3 className={`${fonts.body} text-2xl font-bold text-slate-800 dark:text-slate-200`}>Body Font</h3>
              <p className="mt-2 text-lg text-slate-700 dark:text-slate-300">The quick brown fox jumps over the lazy dog.</p>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Used for paragraphs and general text.</p>
            </div>
          </div>
        </div>
        
        {/* Colors */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Color Palette</h2>
          <ColorPalette title="Primary" colorList={colors.primary} />
          <ColorPalette title="Secondary" colorList={colors.secondary} />
          <ColorPalette title="Neutral" colorList={colors.neutral} />
        </div>

        {/* Assets */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Brand Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assets.map((asset) => (
              <div key={asset.name} className="rounded-lg bg-slate-100 dark:bg-slate-800 p-4 text-center">
                <div className="h-48 flex items-center justify-center p-4">
                  <img src={asset.preview} alt={asset.name} className="max-h-full max-w-full" />
                </div>
                <a
                  href={asset.path}
                  download
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download {asset.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
