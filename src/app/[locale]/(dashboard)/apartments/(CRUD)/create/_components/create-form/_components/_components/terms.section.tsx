import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Edit3, Check, AlertCircle, Shield, Ban } from 'lucide-react';

interface PolicyBlock {
  id: string;
  type: 'include' | 'neutral' | 'restrict';
  title: string;
  content: string;
}

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  isTitle?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  isTitle = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (isTitle) {
        (inputRef.current as HTMLInputElement).select();
      }
    }
  }, [isEditing, isTitle]);

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (isTitle || e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="relative group">
        {isTitle ? (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`${className} bg-transparent border-none outline-none resize-none w-full`}
            placeholder={placeholder}
          />
        ) : (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`${className} bg-transparent border-none outline-none resize-none min-h-[2.5rem] w-full`}
            placeholder={placeholder}
            rows={3}
          />
        )}
        <div className="absolute -right-16 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleSave}
            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
          >
            <Check size={14} />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-gray-500 hover:bg-gray-50 rounded transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-text hover:bg-gray-50/50 rounded-sm transition-colors group relative`}
    >
      {value || (
        <span className="text-gray-400 italic">{placeholder}</span>
      )}
      <Edit3 size={12} className="absolute -right-8 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

const PolicyBlockComponent: React.FC<{
  block: PolicyBlock;
  onUpdate: (id: string, updates: Partial<PolicyBlock>) => void;
  onDelete: (id: string) => void;
}> = ({ block, onUpdate, onDelete }) => {
  const getThemeClasses = () => {
    switch (block.type) {
      case 'include':
        return {
          border: 'border-l-4 border-l-blue-400 border-r border-t border-b border-blue-100',
          bg: 'bg-blue-50/30',
          titleColor: 'text-blue-900',
          contentColor: 'text-blue-800'
        };
      case 'neutral':
        return {
          border: 'border-l-4 border-l-amber-400 border-r border-t border-b border-amber-100',
          bg: 'bg-amber-50/30',
          titleColor: 'text-amber-900',
          contentColor: 'text-amber-800'
        };
      case 'restrict':
        return {
          border: 'border-l-4 border-l-red-400 border-r border-t border-b border-red-100',
          bg: 'bg-red-50/30',
          titleColor: 'text-red-900',
          contentColor: 'text-red-800'
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div className={`${theme.border} ${theme.bg} rounded-r-lg transition-all duration-200 hover:shadow-md group mb-3`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <EditableText
            value={block.title}
            onChange={(value) => onUpdate(block.id, { title: value })}
            placeholder="Enter policy title..."
            className={`font-semibold text-lg ${theme.titleColor} flex-1 pr-8`}
            isTitle={true}
          />
          <button
            onClick={() => onDelete(block.id)}
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
          >
            <X size={16} />
          </button>
        </div>
        
        <EditableText
          value={block.content}
          onChange={(value) => onUpdate(block.id, { content: value })}
          placeholder="Describe your policy details here..."
          className={`${theme.contentColor} leading-relaxed text-sm`}
        />
      </div>
    </div>
  );
};

const PolicySection: React.FC<{
  type: PolicyBlock['type'];
  policies: PolicyBlock[];
  onUpdate: (id: string, updates: Partial<PolicyBlock>) => void;
  onDelete: (id: string) => void;
  onAdd: (type: PolicyBlock['type']) => void;
}> = ({ type, policies, onUpdate, onDelete, onAdd }) => {
  const getSectionConfig = () => {
    switch (type) {
      case 'include':
        return {
          title: 'Includes',
          icon: <Shield size={20} className="text-blue-600" />,
          emptyIcon: <Shield size={24} className="text-blue-300" />,
          bgColor: 'bg-blue-50/50',
          borderColor: 'border-blue-200',
          buttonClass: 'text-blue-700 bg-blue-100 hover:bg-blue-200 border-blue-300',
          headerColor: 'text-blue-900'
        };
      case 'neutral':
        return {
          title: 'Guidelines',
          icon: <AlertCircle size={20} className="text-amber-600" />,
          emptyIcon: <AlertCircle size={24} className="text-amber-300" />,
          bgColor: 'bg-amber-50/50',
          borderColor: 'border-amber-200',
          buttonClass: 'text-amber-700 bg-amber-100 hover:bg-amber-200 border-amber-300',
          headerColor: 'text-amber-900'
        };
      case 'restrict':
        return {
          title: 'Restrictions',
          icon: <Ban size={20} className="text-red-600" />,
          emptyIcon: <Ban size={24} className="text-red-300" />,
          bgColor: 'bg-red-50/50',
          borderColor: 'border-red-200',
          buttonClass: 'text-red-700 bg-red-100 hover:bg-red-200 border-red-300',
          headerColor: 'text-red-900'
        };
    }
  };

  const config = getSectionConfig();
  const sectionPolicies = policies.filter(policy => policy.type === type);

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-6 mb-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {config.icon}
          <h2 className={`text-xl font-bold ${config.headerColor}`}>
            {config.title}
          </h2>
          <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
            {sectionPolicies.length}
          </span>
        </div>
        <button
          onClick={() => onAdd(type)}
          type='button'
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105 text-sm ${config.buttonClass}`}
        >
          <Plus size={14} />
          Add {config.title.slice(0, -1)}
        </button>
      </div>

      <div className="space-y-0">
        {sectionPolicies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="flex justify-center mb-3">
              {config.emptyIcon}
            </div>
            <p className="text-sm">No {config.title.toLowerCase()} yet</p>
            <p className="text-xs text-gray-400 mt-1">Click the button above to add your first item</p>
          </div>
        ) : (
          sectionPolicies.map((policy) => (
            <PolicyBlockComponent
              key={policy.id}
              block={policy}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

function TermsSection() {
  const [policies, setPolicies] = useState<PolicyBlock[]>([
    {
      id: '1',
      type: 'include',
      title: 'Data Security Requirements',
      content: 'All user data must be encrypted at rest and in transit using industry-standard encryption protocols. Regular security audits are mandatory.'
    },
    {
      id: '2',
      type: 'include',
      title: 'Authentication Standards',
      content: 'All systems must implement multi-factor authentication for administrative access and sensitive operations.'
    },
    {
      id: '3',
      type: 'neutral',
      title: 'Performance Guidelines',
      content: 'Applications should maintain response times under 200ms for critical operations. Consider caching strategies for frequently accessed data.'
    },
    {
      id: '4',
      type: 'restrict',
      title: 'Prohibited Activities',
      content: 'Direct database access from client-side code is strictly forbidden. All database operations must go through authenticated API endpoints.'
    }
  ]);

  const addPolicy = (type: PolicyBlock['type']) => {
    const newPolicy: PolicyBlock = {
      id: Date.now().toString(),
      type,
      title: '',
      content: ''
    };
    setPolicies([...policies, newPolicy]);
  };

  const updatePolicy = (id: string, updates: Partial<PolicyBlock>) => {
    setPolicies(policies.map(policy => 
      policy.id === id ? { ...policy, ...updates } : policy
    ));
  };

  const deletePolicy = (id: string) => {
    setPolicies(policies.filter(policy => policy.id !== id));
  };

  return (
    <div className="min-h-screen from-slate-50 to-white">
      <div className="max-w-5xl mx-auto">
        
        {/* Policy Sections */}
        <div className="space-y-6">
          <PolicySection
            type="include"
            policies={policies}
            onUpdate={updatePolicy}
            onDelete={deletePolicy}
            onAdd={addPolicy}
          />
          
          <PolicySection
            type="neutral"
            policies={policies}
            onUpdate={updatePolicy}
            onDelete={deletePolicy}
            onAdd={addPolicy}
          />
          
          <PolicySection
            type="restrict"
            policies={policies}
            onUpdate={updatePolicy}
            onDelete={deletePolicy}
            onAdd={addPolicy}
          />
        </div>
      </div>
    </div>
  );
}

export default TermsSection;