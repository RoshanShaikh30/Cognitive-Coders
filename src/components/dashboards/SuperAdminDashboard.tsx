import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Organization } from '../../types';
import { AttendanceTreeVisual } from '../3d/AttendanceTreeVisual';
import { sound } from '../../services/soundService';
import {
  Globe,
  Building,
  Plus,
  ShieldCheck,
  MapPin,
  CheckCircle,
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const { organizations, createOrganization } = useAuth();

  const [addOrgModalOpen, setAddOrgModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgCode, setNewOrgCode] = useState('');
  const [newOrgCity, setNewOrgCity] = useState('');
  const [newOrgType, setNewOrgType] = useState<Organization['type']>('University');

  const totalGlobalStudents = organizations.reduce((acc, o) => acc + (o.studentCount || 0), 0);
  const globalAverageAttendance =
    organizations.length > 0
      ? organizations.reduce((acc, o) => acc + (o.averageAttendance || 0), 0) / organizations.length
      : 0;

  const handleAddOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    createOrganization({
      name: newOrgName.trim(),
      code: newOrgCode.trim().toUpperCase() || 'INST-01',
      city: newOrgCity.trim() || 'Global Campus',
      type: newOrgType,
    });
    setAddOrgModalOpen(false);
    setNewOrgName('');
    setNewOrgCode('');
    setNewOrgCity('');
  };

  return (
    <div className="space-y-8">
      {/* Global Header */}
      <div className="washi-card-elevated rounded-2xl p-6 border border-[#2b2523]/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#b48728] font-bold font-mono block">
            Global Multi-Tenant Infrastructure Console
          </span>
          <h2 className="text-xl font-bold text-[#1c1917] font-display mt-0.5">
            Super Administrator Control Plane
          </h2>
          <p className="text-xs text-[#78716c] mt-1">
            Governing {organizations.length} multi-tenant isolated educational ecosystems
          </p>
        </div>

        <button
          onClick={() => {
            setAddOrgModalOpen(true);
            sound.playClick();
          }}
          className="px-4 py-2 rounded-xl bg-[#c83a4b] hover:bg-[#b92434] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm self-start lg:self-auto"
        >
          <Plus className="w-4 h-4" />
          Provision Institution
        </button>
      </div>

      {/* Global Telemetry Metric Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl washi-card border border-[#2b2523]/10 shadow-sm">
          <span className="text-[11px] text-[#78716c] block font-mono">TENANTS</span>
          <span className="text-2xl font-bold font-mono text-[#b48728] mt-1 block">
            {organizations.length}
          </span>
          <span className="text-[10px] text-[#57534e] mt-1 block">Active Campuses</span>
        </div>

        <div className="p-4 rounded-xl washi-card border border-[#2b2523]/10 shadow-sm">
          <span className="text-[11px] text-[#78716c] block font-mono">TOTAL LEARNERS</span>
          <span className="text-2xl font-bold font-mono text-[#1c1917] mt-1 block">
            {totalGlobalStudents}
          </span>
          <span className="text-[10px] text-[#57534e] mt-1 block">Enrolled Student Profiles</span>
        </div>

        <div className="p-4 rounded-xl washi-card border border-[#2b2523]/10 shadow-sm">
          <span className="text-[11px] text-[#78716c] block font-mono">ACTIVE COHORTS</span>
          <span className="text-2xl font-bold font-mono text-[#626c59] mt-1 block">
            {organizations.reduce((acc, o) => acc + (o.activeClasses || 0), 0)}
          </span>
          <span className="text-[10px] text-[#57534e] mt-1 block">Department Classes</span>
        </div>

        <div className="p-4 rounded-xl washi-card border border-[#2b2523]/10 shadow-sm">
          <span className="text-[11px] text-[#78716c] block font-mono">NETWORK ATTENDANCE</span>
          <span className="text-2xl font-bold font-mono text-[#c83a4b] mt-1 block">
            {globalAverageAttendance > 0 ? `${globalAverageAttendance.toFixed(1)}%` : 'Pending'}
          </span>
          <span className="text-[10px] text-[#57534e] mt-1 block">Network-Wide Average</span>
        </div>
      </div>

      {/* Global Vitality Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <AttendanceTreeVisual
            percentage={globalAverageAttendance > 0 ? globalAverageAttendance : 100}
            label="Global Federation Vitality"
            size="md"
          />
        </div>

        <div className="lg:col-span-7 washi-card rounded-2xl p-6 border border-[#2b2523]/10 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1c1917] font-display mb-2">
              Architectural Multi-Tenant Isolation
            </h3>
            <p className="text-xs text-[#57534e] leading-relaxed mb-4">
              AttendSphere AI isolates every institution into its own cryptographic tenant partition.
              Role-Based Access Control (RBAC) and Row-Level Security policies prevent any cross-tenant data leakage between institutions.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-white border border-[#2b2523]/10 flex items-center justify-between">
                <span className="text-[#78716c]">Super Admin Scope:</span>
                <span className="text-[#b48728] font-bold">Global Tenant Provisioning & Orchestration</span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#2b2523]/10 flex items-center justify-between">
                <span className="text-[#78716c]">Tenant Data Boundary:</span>
                <span className="text-[#c83a4b] font-bold">Per-Org Scoped Identifiers</span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#2b2523]/10 flex items-center justify-between">
                <span className="text-[#78716c]">Biometric Vault Encryption:</span>
                <span className="text-[#626c59] font-bold">SHA-256 Digest Auditing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Organizations Grid or Empty State */}
      <div>
        <h3 className="text-base font-bold text-[#1c1917] font-display mb-4">
          Provisioned Organizations
        </h3>

        {organizations.length === 0 ? (
          <div className="washi-card rounded-2xl p-12 text-center border border-[#2b2523]/10">
            <Building className="w-12 h-12 text-[#78716c] mx-auto mb-3 opacity-50" />
            <h4 className="text-sm font-bold text-[#1c1917] font-display">
              No Educational Institutions Registered Yet
            </h4>
            <p className="text-xs text-[#78716c] mt-1 max-w-sm mx-auto">
              Click "Provision Institution" above or allow campus administrators to register directly from the landing page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <div
                key={org.id}
                className="washi-card rounded-2xl p-5 border border-[#2b2523]/10 flex flex-col justify-between space-y-4 hover:border-[#c83a4b]/40 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#ede8dc] text-[#1c1917] font-bold">
                      {org.code}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#c83a4b]">
                      {org.averageAttendance || 0}%
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#1c1917] font-display">
                    {org.name}
                  </h4>

                  <p className="text-xs text-[#78716c] mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#b48728]" />
                    {org.city}, {org.country} · {org.type}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#2b2523]/10 text-[11px] font-mono">
                    <div>
                      <span className="text-[#78716c] block">Students</span>
                      <span className="text-[#1c1917] font-bold">{org.studentCount || 0}</span>
                    </div>
                    <div>
                      <span className="text-[#78716c] block">Cohorts</span>
                      <span className="text-[#1c1917] font-bold">{org.activeClasses || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Provision Org Modal */}
      {addOrgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141110]/60 backdrop-blur-md">
          <div className="washi-card-elevated rounded-2xl p-6 border border-[#2b2523]/15 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-[#1c1917] font-display mb-1">
              Provision New Educational Tenant
            </h3>
            <p className="text-xs text-[#78716c] mb-4">
              Instantiate an isolated database partition and institutional credentials.
            </p>

            <form onSubmit={handleAddOrg} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#44403c] mb-1 font-medium">Institution Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Institute of Robotics"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="w-full bg-white border border-[#2b2523]/15 rounded-lg p-2.5 text-[#1c1917] focus:border-[#c83a4b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#44403c] mb-1 font-medium">Institutional Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AIR-TECH"
                  value={newOrgCode}
                  onChange={(e) => setNewOrgCode(e.target.value)}
                  className="w-full bg-white border border-[#2b2523]/15 rounded-lg p-2.5 text-[#1c1917] focus:border-[#c83a4b] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#44403c] mb-1 font-medium">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Seattle"
                    value={newOrgCity}
                    onChange={(e) => setNewOrgCity(e.target.value)}
                    className="w-full bg-white border border-[#2b2523]/15 rounded-lg p-2.5 text-[#1c1917] focus:border-[#c83a4b] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#44403c] mb-1 font-medium">Type</label>
                  <select
                    value={newOrgType}
                    onChange={(e) => setNewOrgType(e.target.value as any)}
                    className="w-full bg-white border border-[#2b2523]/15 rounded-lg p-2.5 text-[#1c1917] focus:outline-none"
                  >
                    <option value="University">University</option>
                    <option value="Institute">Institute</option>
                    <option value="College">College</option>
                    <option value="School">School</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddOrgModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#ede8dc] text-[#57534e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#c83a4b] hover:bg-[#b92434] text-white font-medium flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Provision Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
