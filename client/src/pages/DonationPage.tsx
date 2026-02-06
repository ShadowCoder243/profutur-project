import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import { motion } from 'framer-motion';
import { Heart, Smartphone, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function DonationPage() {
  const [amount, setAmount] = useState(50);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [provider, setProvider] = useState<'orange' | 'vodacom' | 'airtel'>('orange');
  const [isLoading, setIsLoading] = useState(false);
  const [donationStatus, setDonationStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState('');

  const donationMutation = trpc.payments.recordDonation.useMutation();

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  const handleDonate = async () => {
    if (!phoneNumber) {
      toast.error('Veuillez entrer votre numéro de téléphone');
      return;
    }

    setIsLoading(true);
    setDonationStatus('pending');

    try {
      const result = await donationMutation.mutateAsync({
        amount,
        phoneNumber,
        provider,
        message,
      });

      setTransactionHash(result.donation.transactionHash);
      setDonationStatus('success');
      toast.success('Merci pour votre donation! Elle a été enregistrée sur la blockchain.');

      // Reset form
      setTimeout(() => {
        setAmount(50);
        setPhoneNumber('');
        setMessage('');
        setDonationStatus('idle');
      }, 3000);
    } catch (error) {
      setDonationStatus('error');
      toast.error('Erreur lors de la donation');
    } finally {
      setIsLoading(false);
    }
  };

  const providers = [
    { id: 'orange', name: 'Orange Money', icon: '🟠' },
    { id: 'vodacom', name: 'Vodacom Cash', icon: '🔴' },
    { id: 'airtel', name: 'Airtel Money', icon: '🟡' },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 py-12'>
      <div className='max-w-4xl mx-auto px-6'>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='text-center mb-12'>
          <Heart className='w-16 h-16 text-red-500 mx-auto mb-4' />
          <h1 className='text-5xl font-bold text-gray-900 mb-4'>Soutenez PROFUTUR</h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Votre donation aide à transformer l'éducation technique en Afrique. Chaque contribution compte!
          </p>
        </motion.div>

        <div className='grid md:grid-cols-3 gap-8'>
          {/* Donation Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className='md:col-span-2'>
            <Card className='p-8'>
              {/* Amount Selection */}
              <div className='mb-8'>
                <label className='block text-lg font-semibold text-gray-900 mb-4'>Montant de votre donation</label>
                <div className='grid grid-cols-3 gap-3 mb-4'>
                  {presetAmounts.map((preset) => (
                    <motion.button
                      key={preset}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setAmount(preset)}
                      className={`p-3 rounded-lg border-2 font-semibold transition ${
                        amount === preset ? 'border-red-500 bg-red-50 text-red-900' : 'border-gray-200 text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      ${preset}
                    </motion.button>
                  ))}
                </div>
                <div className='flex gap-2'>
                  <span className='text-lg font-semibold text-gray-900'>$</span>
                  <Input
                    type='number'
                    value={amount}
                    onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    className='flex-1'
                    placeholder='Montant personnalisé'
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className='mb-8'>
                <label className='block text-lg font-semibold text-gray-900 mb-4'>Méthode de paiement</label>
                <div className='grid grid-cols-3 gap-3'>
                  {providers.map((p) => (
                    <motion.button
                      key={p.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setProvider(p.id as any)}
                      className={`p-4 rounded-lg border-2 transition ${
                        provider === p.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className='text-3xl mb-2'>{p.icon}</div>
                      <p className='text-sm font-medium text-gray-900'>{p.name}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Phone Number */}
              <div className='mb-8'>
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
              </div>

              {/* Message */}
              <div className='mb-8'>
                <label className='block text-sm font-medium text-gray-900 mb-2'>Message (optionnel)</label>
                <Textarea
                  placeholder='Partagez votre raison de soutenir PROFUTUR...'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                  className='resize-none'
                  rows={4}
                />
              </div>

              {/* Status Messages */}
              {donationStatus === 'pending' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3'>
                  <div className='animate-spin'>
                    <Smartphone className='w-5 h-5 text-blue-900' />
                  </div>
                  <p className='text-blue-900'>Traitement de votre donation...</p>
                </motion.div>
              )}

              {donationStatus === 'success' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
                  <div className='flex items-center gap-3 mb-3'>
                    <CheckCircle className='w-5 h-5 text-green-900' />
                    <p className='text-green-900 font-semibold'>Donation réussie!</p>
                  </div>
                  <p className='text-sm text-green-800 mb-2'>Votre donation a été enregistrée sur la blockchain Hedera.</p>
                  <p className='text-xs text-green-700 break-all'>Hash: {transactionHash}</p>
                </motion.div>
              )}

              {donationStatus === 'error' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3'>
                  <AlertCircle className='w-5 h-5 text-red-900' />
                  <p className='text-red-900'>Erreur lors de la donation. Veuillez réessayer.</p>
                </motion.div>
              )}

              {/* Donate Button */}
              <Button
                onClick={handleDonate}
                disabled={isLoading || !phoneNumber}
                className='w-full bg-red-500 hover:bg-red-600 text-white py-6 text-lg font-semibold'
              >
                <Heart className='w-5 h-5 mr-2' />
                Donner ${amount}
              </Button>
            </Card>
          </motion.div>

          {/* Impact Stats */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className='space-y-6'>
            <Card className='p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white'>
              <Zap className='w-8 h-8 mb-3' />
              <p className='text-sm opacity-90'>Votre impact</p>
              <p className='text-3xl font-bold'>${amount}</p>
            </Card>

            <Card className='p-6'>
              <h3 className='font-bold text-gray-900 mb-4'>Votre donation aide à :</h3>
              <ul className='space-y-3 text-sm text-gray-600'>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 font-bold'>✓</span>
                  <span>Financer des formations techniques</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 font-bold'>✓</span>
                  <span>Supporter les étudiants en difficulté</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 font-bold'>✓</span>
                  <span>Développer nos ressources pédagogiques</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 font-bold'>✓</span>
                  <span>Étendre notre réseau en Afrique</span>
                </li>
              </ul>
            </Card>

            <Card className='p-6 bg-gray-50'>
              <h3 className='font-bold text-gray-900 mb-3'>Blockchain</h3>
              <p className='text-xs text-gray-600'>
                Votre donation est enregistrée sur la blockchain Hedera pour une transparence totale.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
