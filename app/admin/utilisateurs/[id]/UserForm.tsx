'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminUser } from '@prisma/client';

interface UserFormProps {
  user: AdminUser;
}

export default function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Vérifier les mots de passe si on veut les changer
    if (formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
        setIsLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
        setIsLoading(false);
        return;
      }
    }

    try {
      const updateData: Record<string, string> = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Modifications enregistrées' });
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        router.refresh();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la sauvegarde' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/admin/utilisateurs');
        router.refresh();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la suppression' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#111] border border-[#222] rounded-lg p-4 lg:p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Informations</h2>

      {message && (
        <div
          className={`px-4 py-3 rounded-lg mb-6 ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-red-500/20 text-red-400 border border-red-500/50'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Nom</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Rôle</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
          >
            <option value="admin">Administrateur</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <div className="border-t border-[#222] pt-4 mt-6">
          <h3 className="text-white font-medium mb-4">Changer le mot de passe</h3>
          <p className="text-gray-500 text-sm mb-4">Laissez vide pour conserver le mot de passe actuel</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nouveau mot de passe</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Confirmer</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#222]">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 order-2 sm:order-1"
          >
            Supprimer l&apos;utilisateur
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-[#e53e3e] text-white font-semibold rounded-lg hover:bg-[#c53030] transition-colors disabled:opacity-50 order-1 sm:order-2"
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
