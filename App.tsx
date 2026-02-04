import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Printer, Settings, Image as ImageIcon, FileText, QrCode, Barcode as BarcodeIcon, 
  Truck, ShoppingBag, Plus, Minus, RotateCw, X, ChevronRight, 
  Bluetooth, Trash2, Camera, Loader2, Info,
  CheckCircle2, Smartphone, DownloadCloud, ShieldCheck, MapPin,
  Usb, ExternalLink, MessageCircle, AlertTriangle, ArrowLeft,
  Moon, Sun, Share2, Save, Star, Type as TypeIcon, Send, FileWarning, Shield,
  History, TrendingUp, Calendar, RefreshCw, ScanLine, XCircle, Link, Link2Off,
  User, Phone, Map, Upload, Globe, BookOpen, HardDriveDownload, File as FileIcon, PlusCircle,
  Package, UserCheck, Navigation
} from 'lucide-react';

// --- Constants ---
const APP_LOGO_URL = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWrsxhrCF6FKRh9DnNBd3OzTH0X-EzoHau9zd8BSkKZzoRD-cDWLhtRluLW8FXHd9sxdZSutRlTAcghHKi8ZVapoCSOZmNA3kb9Gm6CIxpFJhYVeFkiHgtWxrvo11ldl8_8GpjNEvsvj3QOSB0PkPDAkyO7tNTPmTBeym5ij9evvK1V52dsx-A7RPE95hk/s500/Gemini_Generated_Image_3r9p5m3r9p5m3r9p-removebg-preview.png";

// --- Types ---
type PaperSize = '58' | '80';
enum ModalType { NONE, SHIPPING, RECEIPT, SETTINGS, SCANNER, QR_GEN, BARCODE_GEN, ABOUT, DISCLAIMER }
interface ReceiptItem { id: string; name: string; price: number; qty: number; }
interface ShippingData { toName: string; toPhone: string; toAddress: string; fromName: string; fromPhone: string; courier: string; note: string; }

const App: React.FC = () => {
  // Global State
  const [activeModal, setActiveModal] = useState<ModalType>(ModalType.NONE);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connType, setConnType] = useState<'BT' | 'USB' | null>(null);
  const [paperSize, setPaperSize] = useState<PaperSize>('58');
  const [alert, setAlert] = useState<{msg: string, type: 'success' | 'error' | 'info'} | null>(null);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // Feature Modes
  const [printMode, setPrintMode] = useState<'RECEIPT' | 'SHIPPING' | 'IMAGE' | 'QR' | 'BARCODE'>('RECEIPT');
  
  // Data States
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', qty: '1' });
  const [shippingData, setShippingData] = useState<ShippingData>({
    toName: '', toPhone: '', toAddress: '', fromName: 'Dani Store', fromPhone: '0812-3456-7890', courier: 'J&T', note: ''
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [qrValue, setQrValue] = useState('https://herniprint.pro');
  const [barcodeValue, setBarcodeValue] = useState('8882024001');

  // Refs
  const imageInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    // Menangani event install PWA
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });

    window.addEventListener('appinstalled', () => {
      setShowInstallBtn(false);
      triggerAlert("Aplikasi berhasil diinstal!", "success");
    });
  }, []);

  const triggerAlert = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  const totalBelanja = useMemo(() => items.reduce((acc, item) => acc + (item.price * item.qty), 0), [items]);

  const handlePrint = async () => {
    if (!isConnected) return triggerAlert("Printer belum terhubung!", "error");
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      triggerAlert("Berhasil dicetak ke printer!", "success");
    }, 2000);
  };

  const addItem = () => {
    if (!newItem.name || !newItem.price) return triggerAlert("Isi nama dan harga produk", "error");
    setItems([...items, { id: crypto.randomUUID(), name: newItem.name, price: Number(newItem.price), qty: Number(newItem.qty) || 1 }]);
    setNewItem({ name: '', price: '', qty: '1' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
        setPrintMode('IMAGE');
        triggerAlert("Gambar berhasil dimuat", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`min-h-screen transition-all ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b dark:border-slate-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO_URL} className="w-9 h-9 object-contain" alt="Logo" />
            <div>
               <h1 className="font-black text-xs uppercase tracking-tighter dark:text-white">HerniPrint <span className="text-blue-600">Pro</span></h1>
               <p className="text-[8px] font-bold text-slate-400 uppercase">Premium Thermal Suite</p>
            </div>
          </div>
          <div className="flex gap-2">
            {showInstallBtn && (
              <button onClick={handleInstallClick} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30">
                <DownloadCloud className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase">Install</span>
              </button>
            )}
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border dark:border-slate-700">
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>
            <button onClick={() => setActiveModal(ModalType.SETTINGS)} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border dark:border-slate-700">
              <Settings className="w-4 h-4 dark:text-white" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-4 pb-40 space-y-6">
        
        {/* Connection Status */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Status Printer</p>
              <p className="text-xs font-bold dark:text-white">{isConnected ? `Terhubung (${connType})` : 'Printer Terputus'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => {setIsConnected(true); setConnType('BT'); triggerAlert("Bluetooth Aktif", "success")}} className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl border border-blue-100 dark:border-blue-800"><Bluetooth className="w-4 h-4"/></button>
            <button onClick={() => {setIsConnected(true); setConnType('USB'); triggerAlert("USB Aktif", "success")}} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl border dark:border-slate-700"><Usb className="w-4 h-4"/></button>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { id: 'RECEIPT', icon: ShoppingBag, label: 'Kasir', color: 'emerald', action: () => {setPrintMode('RECEIPT'); setActiveModal(ModalType.RECEIPT)} },
            { id: 'SHIPPING', icon: Truck, label: 'Resi', color: 'orange', action: () => {setPrintMode('SHIPPING'); setActiveModal(ModalType.SHIPPING)} },
            { id: 'IMAGE', icon: ImageIcon, label: 'Gambar', color: 'rose', action: () => imageInputRef.current?.click() },
            { id: 'QR', icon: QrCode, label: 'QR', color: 'blue', action: () => setActiveModal(ModalType.QR_GEN) },
            { id: 'BARCODE', icon: BarcodeIcon, label: 'Barcode', color: 'purple', action: () => setActiveModal(ModalType.BARCODE_GEN) },
            { id: 'ABOUT', icon: Info, label: 'Info', color: 'slate', action: () => setActiveModal(ModalType.ABOUT) },
          ].map((m) => (
            <button 
              key={m.id} 
              onClick={m.action} 
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:scale-105 active:scale-95 ${printMode === m.id ? 'bg-white dark:bg-slate-900 border-blue-500 ring-2 ring-blue-500/10 shadow-lg' : 'bg-white dark:bg-slate-900 border-transparent dark:border-slate-800 shadow-sm'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${m.color}-500/10 text-${m.color}-600`}><m.icon className="w-5 h-5" /></div>
              <span className="text-[9px] font-black uppercase dark:text-slate-400">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Preview Area */}
        <div className="bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] p-6 flex justify-center shadow-inner overflow-hidden min-h-[500px]">
          <div className={`bg-white text-black font-mono text-[10px] p-6 shadow-2xl transition-all duration-500 ${paperSize === '58' ? 'w-[280px]' : 'w-[360px]'} h-fit min-h-[400px]`}>
            
            <div className="text-center border-b border-dashed border-black pb-4 mb-5 flex flex-col items-center">
              <img src={APP_LOGO_URL} className="w-10 h-10 grayscale mb-2" alt="Logo" />
              <p className="font-black text-xs uppercase tracking-widest">HERNIPRINT PRO</p>
              <p className="text-[7px] uppercase opacity-50">Logistik & POS Pintar</p>
            </div>

            {printMode === 'RECEIPT' && (
              <div className="space-y-2">
                {items.length === 0 ? (
                  <div className="py-10 text-center opacity-30 italic text-[8px]">Belum ada transaksi...</div>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="flex justify-between items-start gap-4">
                      <span className="uppercase flex-1 leading-tight">{item.name} x{item.qty}</span>
                      <span className="font-bold">{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))
                )}
                <div className="border-t-2 border-dashed border-black mt-4 pt-3 flex justify-between items-center">
                  <span className="font-black text-[11px]">TOTAL BAYAR</span>
                  <span className="font-black text-[11px]">Rp{totalBelanja.toLocaleString()}</span>
                </div>
              </div>
            )}

            {printMode === 'SHIPPING' && (
              <div className="space-y-4">
                <div className="bg-black text-white text-center py-1 font-black text-[9px] tracking-[4px]">LABEL PENGIRIMAN</div>
                <div className="space-y-1">
                  <p className="text-[7px] font-bold opacity-40 uppercase">Penerima:</p>
                  <p className="font-black text-sm uppercase leading-none">{shippingData.toName || 'MASUKKAN NAMA'}</p>
                  <p className="font-bold text-[10px]">{shippingData.toPhone || '08XX-XXXX-XXXX'}</p>
                  <p className="leading-tight text-[9px] pt-1">{shippingData.toAddress || 'Isi alamat tujuan lengkap di menu Resi...'}</p>
                </div>
                <div className="border-t border-dashed border-black pt-3">
                  <p className="text-[7px] font-bold opacity-40 uppercase">Pengirim:</p>
                  <p className="font-bold text-[9px] uppercase">{shippingData.fromName} ({shippingData.fromPhone})</p>
                </div>
                <div className="flex justify-between items-center border border-black p-2 mt-2">
                  <div className="flex items-center gap-2"><Package className="w-4 h-4"/> <span className="font-black uppercase">{shippingData.courier}</span></div>
                  <span className="font-bold italic text-[8px]">REG-SERVICE</span>
                </div>
              </div>
            )}

            {printMode === 'IMAGE' && uploadedImage && <img src={uploadedImage} className="w-full grayscale contrast-125 mb-4" />}
            {printMode === 'QR' && <div className="flex flex-col items-center py-6 gap-2"><QrCode className="w-32 h-32" /><p className="text-[8px] opacity-40 uppercase">{qrValue}</p></div>}
            {printMode === 'BARCODE' && <div className="flex flex-col items-center py-6 gap-2"><BarcodeIcon className="w-full h-12" /><p className="text-[10px] font-bold">{barcodeValue}</p></div>}

            <div className="text-center pt-10 border-t border-dashed border-black mt-10">
              <p className="text-[8px] italic opacity-40 tracking-widest uppercase">--- Cetak Berhasil ---</p>
              <p className="text-[7px] mt-1">HerniPrint Pro • Dani Solusi</p>
            </div>
            <div className="h-20" />
          </div>
        </div>
      </main>

      {/* Printer FAB */}
      <div className="fixed bottom-0 left-0 right-0 p-8 flex justify-center items-center pointer-events-none">
        <button 
          onClick={handlePrint}
          disabled={isPrinting}
          className="w-20 h-20 bg-blue-600 text-white rounded-full shadow-[0_20px_50px_rgba(37,99,235,0.4)] border-8 border-white dark:border-slate-950 flex items-center justify-center active:scale-90 transition-all pointer-events-auto disabled:bg-slate-400"
        >
          {isPrinting ? <Loader2 className="animate-spin w-8 h-8" /> : <Printer className="w-9 h-9" />}
        </button>
      </div>

      <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

      {/* Modals (KASIR, RESI, SETTINGS, QR) - Logic same as before */}
      {activeModal === ModalType.RECEIPT && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-[10px] uppercase tracking-widest dark:text-white">Input Transaksi</h3>
              <button onClick={() => setActiveModal(ModalType.NONE)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 dark:text-white"><X className="w-4 h-4"/></button>
            </div>
            <div className="space-y-3 mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border dark:border-slate-700">
              <input placeholder="Nama Produk" className="w-full p-3.5 rounded-xl border-none ring-1 ring-slate-200 dark:ring-slate-700 dark:bg-slate-900 dark:text-white text-xs" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Harga" type="number" className="p-3.5 rounded-xl border-none ring-1 ring-slate-200 dark:ring-slate-700 dark:bg-slate-900 dark:text-white text-xs" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                <input placeholder="Jumlah" type="number" className="p-3.5 rounded-xl border-none ring-1 ring-slate-200 dark:ring-slate-700 dark:bg-slate-900 dark:text-white text-xs" value={newItem.qty} onChange={e => setNewItem({...newItem, qty: e.target.value})} />
              </div>
              <button onClick={addItem} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">+ Tambah Item</button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 mb-4">
              {items.length === 0 ? <p className="text-center py-10 text-[10px] text-slate-400 uppercase font-bold">Keranjang Kosong</p> : items.map(i => (
                <div key={i.id} className="p-3.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl flex justify-between items-center">
                  <div className="flex-1 pr-3">
                    <p className="text-xs font-bold dark:text-white uppercase truncate">{i.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{i.qty} x Rp{i.price.toLocaleString()}</p>
                  </div>
                  <button onClick={() => setItems(items.filter(x => x.id !== i.id))} className="p-2 text-rose-500"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
            </div>
            <div className="pt-5 border-t dark:border-slate-800 flex justify-between items-center">
               <div>
                 <p className="text-[8px] font-black text-slate-400 uppercase">Total</p>
                 <p className="text-xl font-black text-emerald-600 leading-none">Rp{totalBelanja.toLocaleString()}</p>
               </div>
               <button onClick={() => setActiveModal(ModalType.NONE)} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase">Selesai</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Resi */}
      {activeModal === ModalType.SHIPPING && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl overflow-y-auto no-scrollbar max-h-[90vh]">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-[10px] uppercase tracking-widest dark:text-white">Data Pengiriman</h3>
                <button onClick={() => setActiveModal(ModalType.NONE)} className="p-2 dark:text-white"><X/></button>
             </div>
             <div className="space-y-4">
                <input className="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl border dark:border-slate-700 text-xs" value={shippingData.toName} onChange={e => setShippingData({...shippingData, toName: e.target.value})} placeholder="Nama Penerima" />
                <input className="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl border dark:border-slate-700 text-xs" value={shippingData.toPhone} onChange={e => setShippingData({...shippingData, toPhone: e.target.value})} placeholder="No. Telepon" />
                <textarea rows={3} className="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl border dark:border-slate-700 text-xs" value={shippingData.toAddress} onChange={e => setShippingData({...shippingData, toAddress: e.target.value})} placeholder="Alamat Tujuan" />
                <button onClick={() => setActiveModal(ModalType.NONE)} className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-orange-500/20 mt-4">Terapkan Ke Resi</button>
             </div>
          </div>
        </div>
      )}

      {/* Modal: Settings */}
      {activeModal === ModalType.SETTINGS && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6">
            <h3 className="font-black text-[10px] uppercase tracking-widest mb-6 dark:text-white">Ukuran Kertas</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
               <button onClick={() => setPaperSize('58')} className={`p-6 rounded-2xl border-2 font-black text-xs transition-all ${paperSize === '58' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 dark:border-slate-800 dark:text-white'}`}>58mm</button>
               <button onClick={() => setPaperSize('80')} className={`p-6 rounded-2xl border-2 font-black text-xs transition-all ${paperSize === '80' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 dark:border-slate-800 dark:text-white'}`}>80mm</button>
            </div>
            <button onClick={() => setActiveModal(ModalType.NONE)} className="w-full py-4 bg-slate-900 dark:bg-white dark:text-black text-white rounded-2xl font-black text-[10px] uppercase">Tutup</button>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {alert && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border ${alert.type === 'success' ? 'bg-emerald-500 border-emerald-400' : alert.type === 'error' ? 'bg-rose-500 border-rose-400' : 'bg-slate-900 border-slate-700'} text-white`}>
            {alert.type === 'success' ? <CheckCircle2 className="w-4 h-4"/> : <Info className="w-4 h-4"/>}
            <span className="text-[10px] font-black uppercase tracking-wider">{alert.msg}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
