'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewUserForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (!formData.name || !formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Tous les champs sont requis' });
      setIsLoading(false);
      return;
    }

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

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        router.push(`/admin/utilisateurs/${user.id}`);
        router.refresh();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la création' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
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
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Prénom Nom"
              required
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@exemple.com"
              required
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Confirmer le mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
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

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#222]">
            <button
              type="button"
              onClick={() => router.push('/admin/utilisateurs')}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-[#e53e3e] text-white font-semibold rounded-lg hover:bg-[#c53030] transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Création...' : 'Créer l\'utilisateur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
