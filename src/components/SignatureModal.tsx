import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { X, Eraser, Check } from 'lucide-react';
export function SignatureModal({ isOpen, onClose, onSign }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Canvas drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    const startDrawing = (e) => {
      setIsDrawing(true);
      const { offsetX, offsetY } = getCoordinates(e, canvas);
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    };
    const draw = (e) => {
      if (!isDrawing) return;
      const { offsetX, offsetY } = getCoordinates(e, canvas);
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
      setHasSignature(true);
    };
    const stopDrawing = () => {
      setIsDrawing(false);
      ctx.closePath();
    };
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    // Touch support
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [isDrawing, isOpen]);
  const getCoordinates = (e, canvas) => {
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top
    };
  };
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };
  const handleSubmit = async () => {
    if (!hasSignature) return;
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    onSign();
  };
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
          onClick={onClose} />

          <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 pointer-events-auto overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900">
                  Sign Document
                </h3>
                <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600">

                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm text-slate-500 mb-4">
                  Draw your signature below using your mouse or finger.
                </p>
                <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 relative overflow-hidden">
                  <canvas
                  ref={canvasRef}
                  width={460}
                  height={200}
                  className="w-full h-[200px] cursor-crosshair touch-none" />

                  {!hasSignature &&
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 font-medium text-2xl">
                      Sign Here
                    </div>
                }
                </div>
                <div className="flex justify-between mt-4">
                  <button
                  onClick={clearCanvas}
                  className="text-sm text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors">

                    <Eraser className="h-4 w-4" /> Clear
                  </button>
                  <p className="text-xs text-slate-400">
                    By clicking submit, you agree to be legally bound.
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                onClick={handleSubmit}
                disabled={!hasSignature}
                isLoading={isSubmitting}
                className="w-32">

                  Submit
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}