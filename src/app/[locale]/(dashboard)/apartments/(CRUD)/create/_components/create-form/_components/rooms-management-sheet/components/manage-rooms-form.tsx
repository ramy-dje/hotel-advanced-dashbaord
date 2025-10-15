import React, { useState } from 'react';
import { Plus, X, Building, Home, ChevronDown, Check, RotateCcw, Search, Settings, Trash2, ChevronUp, Eye, List, Grid } from 'lucide-react';
import PropertyInterface, { Block, Floor, Room, RoomTypes, Section } from '@/interfaces/property.interface';
import { Button } from "@/components/ui/button";


const ROOM_TYPES = [
  'Office', 'Conference Room', 'Storage', 'Kitchen', 'Bathroom', 'Reception',
  'Server Room', 'Break Room', 'Meeting Room', 'Executive Office', 'Lobby',
  'Archive', 'Training Room'
];

const ROOM_STATUS = ['Available', 'Occupied', 'Maintenance', 'Reserved'];

const AVAILABLE_VIEWS = [
  'North View', 'South View', 'East View', 'West View', 'Sunset View', 'Sunrise View',
  'Beach View', 'Mountain View', 'City View', 'Garden View', 'Courtyard View',
  'Street View', 'Ocean View', 'Lake View', 'Forest View', 'Park View'
];

const VIEW_MODES = [
  { id: 'table', name: 'Table View', icon: List },
  { id: 'cards', name: 'Card View', icon: Grid },
  { id: 'views', name: 'View Groups', icon: Eye }
];

interface SmartRangeInputProps {
  onApply: (fromRoom: string, toRoom: string, type: string, status?: string, views?: string[]) => void;
  roomTypes: RoomTypes[];
  availableViews: string[];
}

const SmartRangeInput: React.FC<SmartRangeInputProps> = ({ onApply, roomTypes, availableViews }) => {
  const [fromRoom, setFromRoom] = useState('');
  const [toRoom, setToRoom] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedViews, setSelectedViews] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApply = () => {
    if (fromRoom && toRoom && selectedType) {
      onApply(fromRoom, toRoom, selectedType, selectedStatus, selectedViews);
      setFromRoom('');
      setToRoom('');
      setSelectedType('');
      setSelectedStatus('');
      setSelectedViews([]);
      setIsExpanded(false);
    }
  };

  const toggleView = (view: string) => {
    setSelectedViews(prev =>
      prev.includes(view)
        ? prev.filter(v => v !== view)
        : [...prev, view]
    );
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="text-blue-600" size={18} />
          Smart Bulk Operations
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 px-3 py-1 rounded-md hover:bg-blue-100 text-sm"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">From Room</label>
              <input
                type="number"
                value={fromRoom}
                onChange={(e) => setFromRoom(e.target.value)}
                placeholder="e.g., 101"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">To Room</label>
              <input
                type="number"
                value={toRoom}
                onChange={(e) => setToRoom(e.target.value)}
                placeholder="e.g., 110"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Room Type *</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select type</option>
                {roomTypes?.map((type: RoomTypes) => (
                  <option key={type.id} value={type.typeName}>{type.typeName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Keep current</option>
                {ROOM_STATUS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <button
                onClick={handleApply}
                disabled={!fromRoom || !toRoom || !selectedType}
                className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1 font-medium"
              >
                <Check size={14} />
                Apply Range
              </button>
            </div>

            <div>
              <button
                onClick={() => {
                  setFromRoom('');
                  setToRoom('');
                  setSelectedType('');
                  setSelectedStatus('');
                  setSelectedViews([]);
                }}
                className="w-full px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center gap-1 font-medium"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Add Views (Optional)</label>
            <div className="flex flex-wrap gap-1">
              {availableViews.map(view => (
                <button
                  key={view}
                  onClick={() => toggleView(view)}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${selectedViews.includes(view)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {view}
                </button>
              ))}
            </div>
            {selectedViews.length > 0 && (
              <div className="mt-1 text-xs text-green-600">
                Selected: {selectedViews.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};








interface RoomCardProps {
  room: Room;
  sectionName: string;
  roomTypes: RoomTypes[];
  availableViews: string[];
  onUpdate: (updates: Partial<Room>) => void;
  onDelete: () => void;
  isSelected: boolean;
  onToggleSelect: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  sectionName,
  roomTypes,
  availableViews,
  onUpdate,
  onDelete,
  isSelected,
  onToggleSelect
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800 border-green-200';
      case 'Occupied': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Maintenance': return 'bg-red-100 text-red-800 border-red-200';
      case 'Reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const addView = (view: string) => {
    const currentViews = room.views || [];
    if (!currentViews.includes(view)) {
      onUpdate({ views: [...currentViews, view] });
    }
  };

  const removeView = (view: string) => {
    const currentViews = room.views || [];
    onUpdate({ views: currentViews.filter(v => v !== view) });
  };

  return (
    <div className={`bg-white rounded-lg border p-4 transition-all hover:shadow-md ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
          />
          <div>
            <h4 className="text-base font-semibold text-gray-900">Room {room.number}</h4>
            <p className="text-xs text-gray-600">{sectionName}</p>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded-md transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">TYPE</label>
          <select
            value={room.type || ''}
            onChange={(e) => onUpdate({ type: e.target.value })}
            className="w-full text-xs border border-gray-300 bg-white rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select type</option>
            {roomTypes.map(type => (
              <option key={type.id} value={type.typeName}>{type.typeName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">AREA</label>
          <div className="text-xs text-gray-900">
            {room.area ? `${room.area} m²` : 'Not specified'}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">STATUS</label>
          <select
            value={room.status || ''}
            onChange={(e) => onUpdate({ status: e.target.value as Room['status'] })}
            className={`w-full text-xs border rounded-md px-2 py-1 font-medium ${getStatusColor(room.status || '')}`}
          >
            {ROOM_STATUS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">VIEWS</label>
          <div className="flex flex-wrap gap-1 mb-1">
            {(room.views || []).map(view => (
              <span
                key={view}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {view}
                <button
                  onClick={() => removeView(view)}
                  className="hover:bg-green-200 rounded-full p-0.5"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
          <select
            onChange={(e) => {
              if (e.target.value) {
                addView(e.target.value);
                e.target.value = '';
              }
            }}
            className="w-full text-xs border border-gray-300 bg-white rounded-md px-2 py-1 focus:ring-1 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Add view...</option>
            {availableViews.filter(view => !(view || '').includes(view)).map(view => (
              <option key={view} value={view}>{view}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

interface TableRowProps {
  room: Room;
  roomTypes: RoomTypes[];
  availableViews: string[];
  sectionName: string;
  onUpdate: (updates: Partial<Room>) => void;
  onDelete: () => void;
  isSelected: boolean;
  onToggleSelect: () => void;
}

const TableRow: React.FC<TableRowProps> = ({
  room,
  roomTypes,
  availableViews,
  sectionName,
  onUpdate,
  onDelete,
  isSelected,
  onToggleSelect
}) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const startEdit = (field: string, value: string) => {
    setIsEditing(field);
    setTempValue(value);
  };

  const saveEdit = (field: string) => {
    onUpdate({ [field]: tempValue });
    setIsEditing(null);
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setTempValue('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800 border-green-200';
      case 'Occupied': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Maintenance': return 'bg-red-100 text-red-800 border-red-200';
      case 'Reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const addView = (view: string) => {
    const currentViews = room.views || [];
    if (!currentViews.includes(view)) {
      onUpdate({ views: [...currentViews, view] });
    }
  };

  const removeView = (view: string) => {
    const currentViews = room.views || [];
    onUpdate({ views: currentViews.filter(v => v !== view) });
  };

  return (
    <tr className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}>
      <td className="px-4 py-3 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
        />
      </td>

      <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-900">{sectionName}</td>

      <td className="px-4 py-3 whitespace-nowrap">
        {isEditing === 'number' ? (
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => saveEdit('number')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit('number');
              if (e.key === 'Escape') cancelEdit();
            }}
            className="w-full px-2 py-1 text-xs border border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <span
            onClick={() => startEdit('number', room.number.toString())}
            className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md text-xs font-medium transition-colors"
          >
            {room.number || 'Click to edit'}
          </span>
        )}
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        <select
          defaultValue={room.type || ''}
          onChange={(e) => onUpdate({ type: e.target.value })}
          className="text-xs border border-gray-300 bg-white rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">Select type</option>
          {roomTypes.map(type => (
            <option key={type.key} value={type.typeName}>{type.typeName}</option>
          ))}
        </select>
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        {isEditing === 'area' ? (
          <input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => saveEdit('area')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit('area');
              if (e.key === 'Escape') cancelEdit();
            }}
            className="w-20 px-2 py-1 text-xs border border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <span
            onClick={() => startEdit('area', room.area?.toString() || '')}
            className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md text-xs transition-colors"
          >
            {room.area ? `${room.area} m²` : 'Click to add'}
          </span>
        )}
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        <select
          value={room.status || ''}
          onChange={(e) => onUpdate({ status: e.target.value as Room['status'] })}
          className={`text-xs border rounded-full px-3 py-1 font-medium transition-colors ${getStatusColor(room.status || '')}`}
        >
          {ROOM_STATUS.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </td>

      <td className="px-4 py-3">
        <div className="space-y-1">
          <div className="flex flex-wrap gap-1 max-w-xs">
            {(room.views || []).slice(0, 3).map(view => (
              <span
                key={view}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {view}
                <button
                  onClick={() => removeView(view)}
                  className="hover:bg-green-200 rounded-full p-0.5"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            {(room.views || []).length > 3 && (
              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{(room.views || []).length - 3} more
              </span>
            )}
          </div>
          <select
            onChange={(e) => {
              if (e.target.value) {
                addView(e.target.value);
                e.target.value = '';
              }
            }}
            className="w-full text-xs border border-gray-300 bg-white rounded-md px-2 py-1 focus:ring-1 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Add view...</option>
            {availableViews.filter(view => !(view || []).includes(view)).map(view => (
              <option key={view} value={view}>{view}</option>
            ))}
          </select>
        </div>
      </td>

      <td className="px-4 py-3 whitespace-nowrap text-right text-xs font-medium">
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded-md transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
};

interface FloorContainerProps {
  floor: Floor;
  blockId: string;
  roomTypes: RoomTypes[] | null;
  availableViews?: string[];
  blockName: string;
  onUpdateRoom: (floorId: string, sectionId: string, roomId: string, updates: Partial<Room>) => void;
  onDeleteRoom: (floorId: string, sectionId: string, roomId: string) => void;
  selectedRooms: Set<string>;
  onToggleRoomSelection: (roomId: string) => void;
  searchTerm: string;
  filterType: string;
  filterStatus: string;
  viewMode: string;
}

const FloorContainer: React.FC<FloorContainerProps> = ({
  floor,
  blockId,
  roomTypes,
  availableViews,
  blockName,
  onUpdateRoom,
  onDeleteRoom,
  selectedRooms,
  onToggleRoomSelection,
  searchTerm,
  filterType,
  filterStatus,
  viewMode
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Create a synthetic section structure from the floor's rooms
  const getSectionsWithRooms = () => {
    const sectionsMap: Record<string, Section & { rooms: Room[] }> = {};

    floor.rooms?.forEach(room => {
      const sectionName = room.sectionName || 'Unassigned';
      if (!sectionsMap[sectionName]) {
        sectionsMap[sectionName] = {
          name: sectionName,
          roomFrom: 0,
          roomTo: 0,
          rooms: []
        };
      }
      sectionsMap[sectionName].rooms.push(room);
    });

    return Object.values(sectionsMap);
  };

  const sections = getSectionsWithRooms();

  const getAllFloorRooms = () => {
    const allRooms: Array<{
      room: Room;
      sectionId: string;
      sectionName: string;
    }> = [];

    sections.forEach(section => {
      section.rooms.forEach(room => {
        allRooms.push({
          room,
          sectionId: section.name,
          sectionName: section.name
        });
      });
    });

    return allRooms;
  };

  const getFilteredRooms = () => {
    return getAllFloorRooms().filter(({ room, sectionName }) => {
      const matchesSearch = !searchTerm ||
        room.number.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (room.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        sectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        floor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (room.views || []).some(view => view.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = !filterType || room.type === filterType;
      const matchesStatus = !filterStatus || room.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  };

  const filteredRooms = getFilteredRooms();
  const totalRooms = getAllFloorRooms().length;

  if (filteredRooms.length === 0 && (searchTerm || filterType || filterStatus)) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
      <div
        className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200 cursor-pointer hover:from-gray-100 hover:to-gray-150 transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="text-gray-600" size={16} />
            <h3 className="text-base font-semibold text-gray-900">{floor.name}</h3>
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
              {filteredRooms.length} rooms
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-600">
              {totalRooms} total rooms
            </div>
            {isExpanded ? <ChevronUp className="text-gray-400" size={16} /> : <ChevronDown className="text-gray-400" size={16} />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div>
          {viewMode === 'cards' ? (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRooms.map(({ room, sectionId, sectionName }) => (
                  <RoomCard
                    key={room.id || `${sectionName}-${room.number}`}
                    room={room}
                    roomTypes={roomTypes || []}
                    availableViews={availableViews || []}
                    sectionName={sectionName}
                    onUpdate={(updates) => onUpdateRoom(floor.id!, sectionId, room.id || `${sectionName}-${room.number}`, updates)}
                    onDelete={() => onDeleteRoom(floor.id!, sectionId, room.id || `${sectionName}-${room.number}`)}
                    isSelected={selectedRooms.has(room.id || `${sectionName}-${room.number}`)}
                    onToggleSelect={() => onToggleRoomSelection(room.id || `${sectionName}-${room.number}`)}
                  />
                ))}
              </div>
            </div>
          ) : viewMode === 'views' ? (
            <div className="p-4">
              <div className="space-y-3">
                {availableViews.map(view => {
                  const viewRooms = filteredRooms.filter(({ room }) =>
                    (room.views || []).includes(view)
                  );

                  if (viewRooms.length === 0) return null;

                  return (
                    <div key={view} className="bg-gray-50 rounded-md p-3">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1 text-sm">
                        <Eye size={14} className="text-green-600" />
                        {view} ({viewRooms.length} rooms)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {viewRooms.map(({ room, sectionId, sectionName }) => (
                          <div key={room.id || `${sectionName}-${room.number}`} className="bg-white rounded-md p-2 border border-gray-200 text-xs">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium">Room {room.number}</span>
                                <span className="text-gray-600 ml-1">{room.type}</span>
                              </div>
                              <input
                                type="checkbox"
                                checked={selectedRooms.has(room.id || `${sectionName}-${room.number}`)}
                                onChange={() => onToggleRoomSelection(room.id || `${sectionName}-${room.number}`)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Number</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRooms.map(({ room, sectionId, sectionName }) => (
                    <TableRow
                      key={room.id || `${sectionName}-${room.number}`}
                      roomTypes={roomTypes || []}
                      availableViews={availableViews || []}
                      room={room}
                      sectionName={sectionName}
                      onUpdate={(updates) => onUpdateRoom(floor.id!, sectionId, room.id || `${sectionName}-${room.number}`, updates)}
                      onDelete={() => onDeleteRoom(floor.id!, sectionId, room.id || `${sectionName}-${room.number}`)}
                      isSelected={selectedRooms.has(room.id || `${sectionName}-${room.number}`)}
                      onToggleSelect={() => onToggleRoomSelection(room.id || `${sectionName}-${room.number}`)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredRooms.length === 0 && (
            <div className="text-center py-6">
              <div className="text-gray-500 text-sm mb-1">No rooms in this floor</div>
              <div className="text-gray-400 text-xs">Add some rooms to get started</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface BlockContainerProps {
  block: Block;
  roomTypes: RoomTypes[];
  availableViews?: string[];
  onUpdateRoom: (blockId: string, floorId: string, sectionId: string, roomId: string, updates: Partial<Room>) => void;
  onDeleteRoom: (blockId: string, floorId: string, sectionId: string, roomId: string) => void;
  selectedRooms: Set<string>;
  onToggleRoomSelection: (roomId: string) => void;
  searchTerm: string;
  filterType: string;
  filterStatus: string;
  viewMode: string;
}

const BlockContainer: React.FC<BlockContainerProps> = ({
  block,
  roomTypes,
  availableViews,
  onUpdateRoom,
  onDeleteRoom,
  selectedRooms,
  onToggleRoomSelection,
  searchTerm,
  filterType,
  filterStatus,
  viewMode
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getTotalRooms = () => {
    return block.floors.reduce((total, floor) => {
      return total + (floor.rooms?.length || 0);
    }, 0);
  };

  const totalRooms = getTotalRooms();

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-gray-200 p-4 mb-6">
      <div
        className="flex items-center justify-between mb-4 cursor-pointer p-3 rounded-lg hover:bg-white/50 transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Building className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{block.block_name}</h2>
            <p className="text-gray-600 text-sm">{block.floors.length} floors • {totalRooms} total rooms</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
            {totalRooms} rooms
          </span>
          {isExpanded ? <ChevronUp className="text-gray-400" size={20} /> : <ChevronDown className="text-gray-400" size={20} />}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {block.floors.map(floor => (
            <FloorContainer
              key={floor.id || floor.name}
              roomTypes={roomTypes}
              availableViews={availableViews || []}
              floor={floor}
              blockId={block.id!}
              blockName={block.block_name}
              onUpdateRoom={(floorId, sectionId, roomId, updates) =>
                onUpdateRoom(block.id!, floorId, sectionId, roomId, updates)
              }
              onDeleteRoom={(floorId, sectionId, roomId) =>
                onDeleteRoom(block.id!, floorId, sectionId, roomId)
              }
              selectedRooms={selectedRooms}
              onToggleRoomSelection={onToggleRoomSelection}
              searchTerm={searchTerm}
              filterType={filterType}
              filterStatus={filterStatus}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ManageRoomsProps {
  selectedPropertyDetails?: PropertyInterface;
}

const ManageRooms: React.FC<ManageRoomsProps> = ({ selectedPropertyDetails }) => {
  const [blocks, setBlocks] = useState<Block[]>(selectedPropertyDetails?.blocks || []);
  const [roomTypes, setRoomTypes] = useState<RoomTypes[]>(selectedPropertyDetails?.roomTypes || []);
  const [availableViews, setAvailableViews] = useState<string[]>(selectedPropertyDetails?.views || []);
  const [selectedRooms, setSelectedRooms] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewMode, setViewMode] = useState('table');

  const getAllRooms = () => {
    const allRooms: Array<{
      room: Room;
      blockId: string;
      floorId: string;
      sectionId: string;
      blockName: string;
      floorName: string;
      sectionName: string;
    }> = [];

    console.log('Consoling all property details:', selectedPropertyDetails);

    blocks.forEach(block => {
      block.floors.forEach(floor => {
        const sectionsMap: Record<string, Section & { rooms: Room[] }> = {};

        floor.rooms?.forEach(room => {
          const sectionName = room.sectionName || 'Unassigned';
          if (!sectionsMap[sectionName]) {
            sectionsMap[sectionName] = {
              name: sectionName,
              roomFrom: 0,
              roomTo: 0,
              rooms: []
            };
          }
          sectionsMap[sectionName].rooms.push(room);
        });

        Object.values(sectionsMap).forEach(section => {
          section.rooms.forEach(room => {
            allRooms.push({
              room,
              blockId: block.id!,
              floorId: floor.id!,
              sectionId: section.name,
              blockName: block.block_name,
              floorName: floor.name,
              sectionName: section.name
            });
          });
        });
      });
    });

    return allRooms;
  };

  // Define this helper function globally, or in a utility file
  // or directly within the scope of where both functions can access it.
  const getUniqueRoomId = (blockId: string, floorId: string, sectionId: string, roomNumber: number | string, existingRoomId?: string): string => {
    // If a reliable unique ID already exists on the room object, use it.
    // This assumes 'existingRoomId' is truly unique across all rooms.
    if (existingRoomId) {
      return existingRoomId;
    }
    // Otherwise, construct a compound ID that should be unique based on the hierarchy.
    // This is crucial if room.id is often undefined or not globally unique.
    return `${blockId}-${floorId}-${sectionId}-${roomNumber}`;
  };

  // Assuming 'setBlocks' and 'blocks' are available in this scope (e.g., from useState in React)
  const updateRoom = (blockId: string, floorId: string, sectionId: string, roomIdToUpdate: string, updates: Partial<Room>) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          floors: block.floors.map(floor => {
            if (floor.id === floorId) {
              const updatedRooms = floor.rooms?.map(room => {
                // Use the helper to generate the consistent ID for the current room in the loop
                const currentRoomIdentifier = getUniqueRoomId(blockId, floorId, sectionId, room.number, room.id);

                // Compare with the ID passed to updateRoom
                if (currentRoomIdentifier === roomIdToUpdate) {
                  return { ...room, ...updates };
                }
                return room;
              }) || [];

              return { ...floor, rooms: updatedRooms };
            }
            return floor;
          })
        };
      }
      return block;
    }));
  };

  const applyRangeUpdate = (fromRoom: number, toRoom: number, type: string, status: any, views: string[]) => {
    const allRooms = getAllRooms();

    console.log('Applying range update from:', fromRoom, 'to:', toRoom, 'type:', type, 'status:', status, 'views:', views);
    console.log('All rooms before update:', allRooms);

    const extractRoomNumber = (roomStr: string | number): number => {
      console.log('Extracting room number from:', roomStr);
      if (typeof roomStr === 'number') {
        return roomStr; // If it's already a number, just return it.
      }
      // If it's not a number, ensure it's treated as a string before calling .match()
      const match = String(roomStr).match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };

    const fromNum = extractRoomNumber(fromRoom);
    const toNum = extractRoomNumber(toRoom);

    if (fromNum === 0 || toNum === 0) return;

    const minNum = Math.min(fromNum, toNum);
    const maxNum = Math.max(fromNum, toNum);

    allRooms.forEach(({ room, blockId, floorId, sectionId }) => {
      const roomNum = extractRoomNumber(room.number); // Apply extraction/parsing here
      if (roomNum >= minNum && roomNum <= maxNum) {
        console.log(`Updating room ${roomNum}`);
        const updates = { type };
        if (status) updates.status = status;
        if (views && views.length > 0) {
          const currentViews = room.views || [];

          const combinedViews = [];
          for (let i = 0; i < currentViews.length; i++) {
            combinedViews.push(currentViews[i]);
          }
          for (let i = 0; i < views.length; i++) {
            combinedViews.push(views[i]);
          }

          const uniqueViews = [];
          const seen = {};

          for (let i = 0; i < combinedViews.length; i++) {
            const view = combinedViews[i];
            if (!seen[view]) {
              seen[view] = true;
              uniqueViews.push(view);
            }
          }
          updates.views = uniqueViews;
        }

        const targetRoomIdentifier = getUniqueRoomId(blockId, floorId, sectionId, room.number, room.id);

        updateRoom(blockId, floorId, sectionId, targetRoomIdentifier, updates);
        console.log(`Room ${roomNum} updated with`, updates);
      }
    });

    // Since updateRoom is synchronous and updates state,
    // any components consuming 'blocks' should re-render automatically.
    // If you need a manual refresh (e.g., if getAllRooms() caches), you'd put it here.
  };



  const deleteRoom = (blockId: string, floorId: string, sectionId: string, roomId: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          floors: block.floors.map(floor => {
            if (floor.id === floorId) {
              const updatedRooms = floor.rooms?.filter(room => {
                const currentId = room.id || `${sectionId}-${room.number}`;
                return currentId !== roomId;
              }) || [];

              return { ...floor, rooms: updatedRooms };
            }
            return floor;
          })
        };
      }
      return block;
    }));
  };

  const toggleRoomSelection = (roomId: string) => {
    const newSelected = new Set(selectedRooms);
    if (newSelected.has(roomId)) {
      newSelected.delete(roomId);
    } else {
      newSelected.add(roomId);
    }
    setSelectedRooms(newSelected);
  };

  const selectAllVisible = () => {
    const allRooms = getAllRooms();
    const visibleRoomIds = allRooms
      .filter(({ room, blockName, floorName, sectionName }) => {
        const matchesSearch = !searchTerm ||
          room.number.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          (room.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          blockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          floorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (room.views || []).some(view => view.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = !filterType || room.type === filterType;
        const matchesStatus = !filterStatus || room.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
      })
      .map(({ room, sectionId }) => room.id || `${sectionId}-${room.number}`);

    setSelectedRooms(new Set(visibleRoomIds));
  };

  const clearSelection = () => {
    setSelectedRooms(new Set());
  };

  const allRooms = getAllRooms();
  const visibleRoomsCount = allRooms.filter(({ room, blockName, floorName, sectionName }) => {
    const matchesSearch = !searchTerm ||
      room.number.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      blockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      floorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.views || []).some(view => view.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = !filterType || room.type === filterType;
    const matchesStatus = !filterStatus || room.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  }).length;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl pt-6 px-4 min-w-full">
        {/* <div className="mb-6">
          {/* <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Manage Rooms For {selectedPropertyDetails?.propertyName || "Property"}{" "}
            {selectedPropertyDetails?.code && `(${selectedPropertyDetails?.code})`}
          </h1>

          <p className="text-gray-600 text-base">Modern containerized interface with smart bulk operations and flexible views</p>
        </div> */}

        <SmartRangeInput onApply={applyRangeUpdate} roomTypes={roomTypes} availableViews={availableViews} />

        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search rooms, types, views..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Types</option>
              {roomTypes.map(type => (
                <option key={type.id} value={type.typeName}>{type.typeName}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Status</option>
              {ROOM_STATUS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={selectAllVisible}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Select All Visible ({visibleRoomsCount})
              </button>
              <button
                onClick={clearSelection}
                className="text-gray-600 hover:text-gray-700 font-medium text-sm"
              >
                Clear Selection
              </button>
              {selectedRooms.size > 0 && (
                <span className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded-full">
                  {selectedRooms.size} selected
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-md p-1">
                {VIEW_MODES.map(mode => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id)}
                      title={mode.name}
                      className={`p-1.5 rounded-sm transition-colors ${viewMode === mode.id
                        ? 'bg-white text-blue-600 '
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      <Icon size={14} />
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-gray-600 font-medium">
                Showing {visibleRoomsCount} of {allRooms.length} rooms
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {blocks.map(block => (
            <BlockContainer
              key={block.id || block.block_name}
              block={block}
              roomTypes={roomTypes}
              availableViews={availableViews}
              onUpdateRoom={updateRoom}
              onDeleteRoom={deleteRoom}
              selectedRooms={selectedRooms}
              onToggleRoomSelection={toggleRoomSelection}
              searchTerm={searchTerm}
              filterType={filterType}
              filterStatus={filterStatus}
              viewMode={viewMode}
            />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {ROOM_STATUS.map(status => {
            const count = allRooms.filter(({ room }) => room.status === status).length;
            const percentage = allRooms.length > 0 ? (count / allRooms.length * 100).toFixed(1) : '0';

            return (
              <div key={status} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="text-xl font-bold text-gray-900 mb-1">{count}</div>
                <div className="text-xs text-gray-600 font-medium">{status} ({percentage}%)</div>
              </div>
            );
          })}
        </div>
        <div className='flex justify-end space-x-4 mt-6'>
           <Button
            onClick={() => {
              // Handle save logic here
              console.log('Save clicked');
            }}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Handle save logic here
              console.log('Save clicked');
            }}
          >
            Save Changes
          </Button>
        </div>
        
      </div>
    </div>
  );
}

export default ManageRooms;