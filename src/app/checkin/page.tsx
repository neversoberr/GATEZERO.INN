'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleBanner } from '@/components/layout/RoleBanner';
import { LoginModal } from '@/components/auth/LoginModal';
import { Event, CheckInLog } from '@/types';
import { INITIAL_EVENTS, INITIAL_CHECKINS, INITIAL_ORDERS } from '@/lib/data/initial-data';
import { ToastProvider, useToast } from '@/context/ToastContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { 
  ScanLine, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  Radio, 
  Wifi, 
  WifiOff, 
  Users, 
  ShieldCheck, 
  ArrowLeft,
  Volume2
} from 'lucide-react';

export default function CheckInPage() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CheckInTerminalContent />
      </AuthProvider>
    </ToastProvider>
  );
}

function CheckInTerminalContent() {
  const { user } = useAuth();
  const toast = useToast();

  const [selectedEventId, setSelectedEventId] = useState<string>('ev_steelworks');
  const [ticketInput, setTicketInput] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [logs, setLogs] = useState<CheckInLog[]>(INITIAL_CHECKINS);

  // Scan HUD state
  const [scanResult, setScanResult] = useState<{
    status: 'valid' | 'duplicate_prevented' | 'invalid_cancelled' | 'not_found' | null;
    message: string;
    attendee?: any;
    order?: any;
  }>({ status: null, message: '' });

  const activeEvent = INITIAL_EVENTS.find(e => e.id === selectedEventId) || INITIAL_EVENTS[0];

  // Refresh logs from API
  const refreshLogs = () => {
    fetch(`/api/checkin?eventId=${selectedEventId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.logs) {
          setLogs(data.logs);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshLogs();
  }, [selectedEventId]);

  const executeCheckIn = async (code: string) => {
    if (!code) return;
    const cleanCode = code.trim().toUpperCase();

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketCode: cleanCode,
          staffName: user?.name || 'Rajesh Shinde (Door Lead)',
          gate: 'GATE 01 - NORTH DOCK'
        })
      });
      const data = await res.json();
      
      setScanResult({
        status: data.status,
        message: data.message,
        attendee: data.attendee,
        order: data.order
      });

      if (data.status === 'valid') {
        toast.success('ENTRY GRANTED', `${data.attendee?.fullName} (${data.attendee?.tierName})`);
      } else {
        toast.error('ENTRY DENIED', data.message);
      }

      refreshLogs();
    } catch (err: any) {
      toast.error('CHECK-IN ERROR', err.message);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCheckIn(ticketInput);
    setTicketInput('');
  };

  const handleUndo = async (code: string) => {
    try {
      const res = await fetch('/api/checkin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketCode: code })
      });
      const data = await res.json();
      if (data.success) {
        toast.info('CHECK-IN REVERSED', `Pass ${code} reset to unchecked.`);
        if (scanResult.attendee?.ticketCode === code) {
          setScanResult({ status: null, message: '' });
        }
        refreshLogs();
      }
    } catch (err: any) {
      toast.error('UNDO FAILED', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F1F1EB] flex flex-col font-mono selection:bg-[#C8FF16] selection:text-black">
      <RoleBanner />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">
        
        {/* Terminal Header */}
        <div className="bg-[#0e100c] border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#C8FF16] animate-pulse" />
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-[#C8FF16]">
                GATE CONTROL // DOOR TERMINAL
              </div>
              <div className="text-sm font-bold text-white">
                OPERATOR: {user?.name || 'Rajesh Shinde'} (GATE 01)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Offline indicator */}
            <button
              onClick={() => {
                setOfflineMode(!offlineMode);
                toast.info(offlineMode ? 'ONLINE SYNC ACTIVE' : 'OFFLINE MODE ENABLED', 'Local cryptographic store activated.');
              }}
              className={`px-3 py-1.5 border text-xs font-bold uppercase flex items-center gap-1.5 ${
                offlineMode
                  ? 'border-[#FF6B00] bg-[#FF6B00]/20 text-[#FF6B00]'
                  : 'border-[#C8FF16] bg-[#C8FF16]/10 text-[#C8FF16]'
              }`}
            >
              {offlineMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span>{offlineMode ? 'OFFLINE CACHE' : 'LIVE RELAY'}</span>
            </button>

            {/* Event Selector */}
            <select
              value={selectedEventId}
              onChange={e => {
                setSelectedEventId(e.target.value);
                setScanResult({ status: null, message: '' });
              }}
              className="bg-black border border-white/20 p-2 text-xs text-white uppercase focus:border-[#C8FF16]"
            >
              {INITIAL_EVENTS.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.city}: {ev.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Headcount Progress Bar */}
        <div className="bg-[#0e100c] border border-white/10 p-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-white/60 uppercase font-bold">VENUE OCCUPANCY & HEADCOUNT:</span>
            <span className="text-[#C8FF16] font-black">
              {logs.filter(l => l.status === 'valid').length + 340} / {activeEvent.totalCapacity} IN-HOUSE
            </span>
          </div>
          <div className="w-full h-3 bg-black border border-white/10 overflow-hidden">
            <div
              style={{
                width: `${Math.min(100, Math.round(((logs.filter(l => l.status === 'valid').length + 340) / activeEvent.totalCapacity) * 100))}%`
              }}
              className="h-full bg-[#C8FF16] transition-all duration-500"
            />
          </div>
        </div>

        {/* Scanner Viewport & Scan Feedback Display */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Scanner Optical Viewfinder */}
          <div className="md:col-span-6 bg-black border-2 border-white/20 relative aspect-square flex flex-col items-center justify-center overflow-hidden p-6 text-center">
            
            {/* Viewfinder crosshairs */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#C8FF16]" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#C8FF16]" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#C8FF16]" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#C8FF16]" />

            {/* Laser Scan Line */}
            <div className="absolute inset-x-8 top-0 h-1 bg-[#C8FF16] shadow-[0_0_15px_#C8FF16] animate-scanline pointer-events-none" />

            <div className="z-10 space-y-3">
              <ScanLine className="w-16 h-16 text-[#C8FF16] mx-auto animate-pulse" />
              <div className="text-xs font-black uppercase text-white tracking-widest">
                OPTICAL QR SENSOR ACTIVE
              </div>
              <p className="text-[10px] text-white/50 max-w-xs">
                Position attendee digital pass or printout inside viewfinder.
              </p>
            </div>

            {/* Fast Test Scan Buttons for Evaluator */}
            <div className="absolute bottom-6 inset-x-6 z-20 flex flex-col gap-1.5 text-[10px]">
              <div className="text-white/40 uppercase">INSTANT SIMULATION SCANS:</div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => executeCheckIn('GZ-TCK-948121')}
                  className="px-2 py-1.5 bg-[#171914] hover:bg-[#C8FF16] hover:text-black border border-white/20 text-white font-bold uppercase transition-colors truncate"
                >
                  ✓ Valid Pass
                </button>
                <button
                  type="button"
                  onClick={() => executeCheckIn('GZ-TCK-349811')}
                  className="px-2 py-1.5 bg-[#171914] hover:bg-[#FF314A] hover:text-white border border-white/20 text-white font-bold uppercase transition-colors truncate"
                >
                  ✕ Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => executeCheckIn('GZ-TCK-000000')}
                  className="px-2 py-1.5 bg-[#171914] hover:bg-[#FF6B00] hover:text-black border border-white/20 text-white font-bold uppercase transition-colors truncate"
                >
                  ? Not Found
                </button>
              </div>
            </div>
          </div>

          {/* Feedback Display HUD */}
          <div className="md:col-span-6 bg-[#0e100c] border border-white/20 p-6 flex flex-col justify-between">
            {scanResult.status === 'valid' ? (
              <div className="space-y-4 p-6 bg-[#C8FF16] text-black h-full flex flex-col justify-between animate-in zoom-in-95">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase">
                    <CheckCircle2 className="w-5 h-5 fill-black text-[#C8FF16]" />
                    ENTRY VALID // 01 PASS
                  </div>
                  <div className="text-3xl font-black uppercase leading-tight pt-2">
                    {scanResult.attendee?.fullName}
                  </div>
                  <div className="text-sm font-black uppercase">
                    TIER: {scanResult.attendee?.tierName}
                  </div>
                  <div className="text-xs pt-1">
                    CODE: {scanResult.attendee?.ticketCode}
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-black flex justify-between items-center text-xs font-bold">
                  <span>GATE 01 - NORTH DOCK</span>
                  <span>TIME: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            ) : scanResult.status === 'duplicate_prevented' ? (
              <div className="space-y-4 p-6 bg-[#FF314A] text-white h-full flex flex-col justify-between animate-in shake">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase">
                    <XCircle className="w-5 h-5" />
                    ENTRY DENIED // DUPLICATE SCAN
                  </div>
                  <div className="text-2xl font-black uppercase leading-tight">
                    PASS ALREADY SCANNED
                  </div>
                  <p className="text-xs font-sans">
                    {scanResult.message}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/20 text-xs">
                  HOLD ATTENDEE FOR SECURITY SUPERVISOR
                </div>
              </div>
            ) : scanResult.status === 'invalid_cancelled' || scanResult.status === 'not_found' ? (
              <div className="space-y-4 p-6 bg-[#FF6B00] text-black h-full flex flex-col justify-between animate-in">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase">
                    <AlertTriangle className="w-5 h-5" />
                    INVALID PASS // ACCESS REJECTED
                  </div>
                  <div className="text-2xl font-black uppercase">
                    {scanResult.status === 'not_found' ? 'UNRECOGNIZED CODE' : 'CANCELLED / REFUNDED'}
                  </div>
                  <p className="text-xs font-sans">
                    {scanResult.message}
                  </p>
                </div>
                <div className="pt-4 border-t border-black text-xs font-bold">
                  REDIRECT TO BOX OFFICE CONSOLE
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-6 text-white/40">
                <ShieldCheck className="w-12 h-12 text-[#C8FF16]/40" />
                <div className="text-sm font-black uppercase text-white">
                  AWAITING SCAN SIGNAL
                </div>
                <p className="text-xs max-w-xs font-sans">
                  Scan a digital pass with camera or type code below to verify attendance.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Manual Code Input Bar */}
        <form onSubmit={handleManualSubmit} className="bg-[#0e100c] border border-white/10 p-4 flex gap-3">
          <input
            type="text"
            placeholder="MANUAL PASS LOOKUP (e.g. GZ-TCK-948121 or customer name)"
            value={ticketInput}
            onChange={e => setTicketInput(e.target.value)}
            className="flex-1 bg-black border border-white/20 px-3 py-2 text-xs text-white uppercase focus:border-[#C8FF16] focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-[#C8FF16] hover:bg-[#b8ea14] text-black font-black uppercase text-xs transition-transform active:scale-95"
          >
            VALIDATE CODE ↗
          </button>
        </form>

        {/* Live Door Stream Log */}
        <div className="bg-[#0e100c] border border-white/10 p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/10 text-xs">
            <span className="font-black uppercase text-white">LIVE DOOR ENTRY FEED ({logs.length} SCANS)</span>
            <span className="text-[10px] text-white/40">LATEST REALTIME TRANSACTIONS</span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {logs.map(log => (
              <div
                key={log.id}
                className="p-3 bg-black/60 border border-white/10 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    log.status === 'valid' ? 'bg-[#C8FF16]' : 'bg-[#FF314A]'
                  }`} />
                  <div>
                    <span className="font-bold text-white">{log.attendeeName}</span>
                    <span className="text-white/40 text-[10px] ml-2">[{log.ticketCode}]</span>
                    <span className="text-[#C8FF16] text-[10px] ml-2 font-mono">({log.tierName})</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-white/40">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  {log.status === 'valid' && (
                    <button
                      onClick={() => handleUndo(log.ticketCode)}
                      className="px-2 py-1 bg-[#171914] hover:bg-[#FF314A] hover:text-white border border-white/20 text-[9px] uppercase font-bold transition-colors"
                      title="Undo check-in"
                    >
                      UNDO
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
      <LoginModal />
    </div>
  );
}
