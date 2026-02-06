import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { motion } from 'framer-motion';
import { Smartphone, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentPageProps {
  formationId: number;
  formationTitle: string;
  amount: number;
  onSuccess?: () => void;
}

export default function PaymentPage({ formationId, formationTitle, amount, onSuccess }: PaymentPageProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState<'orange' | 'vodacom' | 'airtel'>('orange');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const paymentMutation = trpc.payments.initiateMobileMoneyPayment.useMutation();

  const handlePayment = async () => {
    if (!phoneNumber) {
      toast.error('Veuillez entrer votre numéro de téléphone');
      return;
    }

    setIsLoading(true);
    setPaymentStatus('pending');

    try {
      const result = await paymentMutation.mutateAsync({
        amount,
        phoneNumber,
        provider,
        formationId,
      });

      setPaymentStatus('success');
      toast.success('Paiement initié! Veuillez confirmer sur votre téléphone.');

      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (error) {
      setPaymentStatus('error');
      toast.error('Erreur lors du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  const providers = [
    { id: 'orange', name: 'Orange Money', icon: '🟠', color: 'from-orange-500 to-orange-600' },
    { id: 'vodacom', name: 'Vodacom Cash', icon: '🔴', color: 'from-red-500 to-red-600' },
    { id: 'airtel', name: 'Airtel Money', icon: '🟡', color: 'from-yellow-500 to-yellow-600' },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12'>
      <div className='max-w-2xl mx-auto px-6'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>Paiement Sécurisé</h1>
          <p className='text-gray-600'>Complétez votre inscription à {formationTitle}</p>
        </motion.div>

        {/* Formation Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='mb-8'>
          <Card className='p-6 border-2 border-blue-200'>
            <div className='flex justify-between items-center'>
              <div>
                <p className='text-gray-600 text-sm'>Formation</p>
                <h2 className='text-2xl font-bold text-gray-900'>{formationTitle}</h2>
              </div>
              <div className='text-right'>
                <p className='text-gray-600 text-sm'>Montant à payer</p>
                <p className='text-4xl font-bold text-blue-900'>${amount}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Payment Method Selection */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mb-8'>
          <h3 className='text-xl font-bold text-gray-900 mb-4'>Choisissez votre méthode de paiement</h3>
          <div className='grid md:grid-cols-3 gap-4'>
            {providers.map((p) => (
              <motion.button
                key={p.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setProvider(p.id as any)}
                className={`p-6 rounded-lg border-2 transition ${
                  provider === p.id ? `border-blue-900 bg-blue-50` : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className='text-4xl mb-2'>{p.icon}</div>
                <p className='font-semibold text-gray-900'>{p.name}</p>
                {provider === p.id && <CheckCircle className='w-5 h-5 text-blue-900 mx-auto mt-2' />}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Phone Number Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className='mb-8'>
          <label className='block text-sm font-medium text-gray-900 mb-2'>Numéro de téléphone</label>
          <div className='relative'>
            <Smartphone className='absolute left-3 top-3 w-5 h-5 text-gray-400' />
            <Input
              type='tel'
              placeholder='+243812345678'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className='pl-10'
              disabled={isLoading}
            />
          </div>
          <p className='text-xs text-gray-500 mt-2'>Format: +243 (RDC) ou votre numéro local</p>
        </motion.div>

        {/* Status Messages */}
        {paymentStatus === 'pending' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3'>
            <div className='animate-spin'>
              <Smartphone className='w-5 h-5 text-blue-900' />
            </div>
            <p className='text-blue-900'>Paiement en cours... Veuillez confirmer sur votre téléphone</p>
          </motion.div>
        )}

        {paymentStatus === 'success' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3'>
            <CheckCircle className='w-5 h-5 text-green-900' />
            <p className='text-green-900'>Paiement réussi! Redirection...</p>
          </motion.div>
        )}

        {paymentStatus === 'error' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3'>
            <AlertCircle className='w-5 h-5 text-red-900' />
            <p className='text-red-900'>Erreur lors du paiement. Veuillez réessayer.</p>
          </motion.div>
        )}

        {/* Payment Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Button
            onClick={handlePayment}
            disabled={isLoading || !phoneNumber}
            className='w-full bg-blue-900 hover:bg-blue-800 text-white py-6 text-lg font-semibold'
          >
            {isLoading ? 'Traitement en cours...' : `Payer $${amount}`}
          </Button>
        </motion.div>

        {/* Security Info */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className='mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200'>
          <p className='text-xs text-gray-600'>
            ✓ Paiement sécurisé par les fournisseurs de Mobile Money<br />
            ✓ Vos données sont chiffrées et protégées<br />
            ✓ Aucun frais supplémentaire
          </p>
        </motion.div>
      </div>
    </div>
  );
}
