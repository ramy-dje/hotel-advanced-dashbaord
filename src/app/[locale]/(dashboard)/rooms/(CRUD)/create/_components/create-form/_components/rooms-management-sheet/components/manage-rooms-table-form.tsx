import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Building, Home, Grid3X3, ChevronDown, Check } from 'lucide-react';
import ManageRooms from './manage-rooms-form';

interface Room {
  id: string;
  number: string;
  type: string;
}

interface Section {
  id: string;
  name: string;
  rooms: Room[];
}

interface Floor {
  id: string;
  name: string;
  sections: Section[];
}

interface Block {
  id: string;
  name: string;
  floors: Floor[];
}

const ROOM_TYPES = [
  'Office',
  'Conference Room',
  'Storage',
  'Kitchen',
  'Bathroom',
  'Reception',
  'Server Room',
  'Break Room',
  'Meeting Room',
  'Executive Office'
];

interface DropdownSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  roomId: string;
  onFillStart?: (roomId: string, value: string) => void;
  isFillTarget?: boolean;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
  roomId,
  onFillStart,
  isFillTarget = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFillHandleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (value && onFillStart) {
      onFillStart(roomId, value);
    }
  };

  return (
    <div 
      className={`relative ${className}`} 
      ref={dropdownRef}
      data-room-id={roomId}
    >
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between ${
            isFillTarget ? 'bg-blue-100 border-blue-400 border-2' : ''
          }`}
        >
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {value || placeholder}
          </span>
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Excel-like drag handle */}
        {value && (
          <div
            onMouseDown={handleFillHandleMouseDown}
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-600 cursor-se-resize hover:bg-blue-700 border border-white shadow-sm select-none z-10"
            style={{
              clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)'
            }}
            title="Drag to fill down"
          />
        )}
      </div>
      
      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 flex items-center justify-between"
            >
              <span>{option}</span>
              {value === option && <Check size={16} className="text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface EditableCellProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  onChange,
  placeholder = "",
  className = ""
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`w-full px-2 py-1 border-2 border-blue-500 rounded focus:outline-none ${className}`}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`px-2 py-1 cursor-text hover:bg-gray-50 rounded min-h-[2rem] flex items-center ${className}`}
    >
      {value || <span className="text-gray-400 italic">{placeholder}</span>}
    </div>
  );
};

function ManageRoomsTableForm() {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: '1',
      name: 'Block A',
      floors: [
        {
          id: '1-1',
          name: 'Floor 1',
          sections: [
            {
              id: '1-1-1',
              name: 'North Wing',
              rooms: [
                { id: '1-1-1-1', number: '101', type: 'Office' },
                { id: '1-1-1-2', number: '102', type: '' },
                { id: '1-1-1-3', number: '103', type: '' },
                { id: '1-1-1-4', number: '104', type: '' },
                { id: '1-1-1-5', number: '105', type: '' }
              ]
            },
            {
              id: '1-1-2',
              name: 'South Wing',
              rooms: [
                { id: '1-1-2-1', number: '106', type: 'Storage' },
                { id: '1-1-2-2', number: '107', type: '' },
                { id: '1-1-2-3', number: '108', type: '' }
              ]
            }
          ]
        },
        {
          id: '1-2',
          name: 'Floor 2',
          sections: [
            {
              id: '1-2-1',
              name: 'East Wing',
              rooms: [
                { id: '1-2-1-1', number: '201', type: 'Executive Office' },
                { id: '1-2-1-2', number: '202', type: '' },
                { id: '1-2-1-3', number: '203', type: '' }
              ]
            }
          ]
        }
      ]
    }
  ]);

  const [selectedRooms, setSelectedRooms] = useState<Set<string>>(new Set());
  const [fillState, setFillState] = useState<{
    isActive: boolean;
    sourceRoomId: string;
    sourceValue: string;
    targetRooms: Set<string>;
  }>({
    isActive: false,
    sourceRoomId: '',
    sourceValue: '',
    targetRooms: new Set()
  });

  // Get all rooms in the exact order they appear in the table
  const getAllRoomsInTableOrder = (): Array<{ room: Room; blockId: string; floorId: string; sectionId: string }> => {
    const allRooms: Array<{ room: Room; blockId: string; floorId: string; sectionId: string }> = [];
    blocks.forEach(block => {
      block.floors.forEach(floor => {
        floor.sections.forEach(section => {
          section.rooms.forEach(room => {
            allRooms.push({ room, blockId: block.id, floorId: floor.id, sectionId: section.id });
          });
        });
      });
    });
    return allRooms;
  };

  // Set up global mouse event handlers for drag-to-fill
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!fillState.isActive) return;

      // Find the room element under the mouse
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const roomElement = element?.closest('[data-room-id]') as HTMLElement;
      
      if (roomElement) {
        const roomId = roomElement.getAttribute('data-room-id');
        if (roomId && roomId !== 'bulk-select') {
          const allRoomsData = getAllRoomsInTableOrder();
          const sourceIndex = allRoomsData.findIndex(data => data.room.id === fillState.sourceRoomId);
          const targetIndex = allRoomsData.findIndex(data => data.room.id === roomId);

          if (sourceIndex !== -1 && targetIndex !== -1) {
            const startIndex = Math.min(sourceIndex, targetIndex);
            const endIndex = Math.max(sourceIndex, targetIndex);
            
            const newTargetRooms = new Set<string>();
            for (let i = startIndex; i <= endIndex; i++) {
              newTargetRooms.add(allRoomsData[i].room.id);
            }
            
            setFillState(prev => ({
              ...prev,
              targetRooms: newTargetRooms
            }));
          }
        }
      }
    };

    const handleMouseUp = () => {
      if (fillState.isActive && fillState.targetRooms.size > 0) {
        // Apply the value to ALL target rooms
        const allRoomsData = getAllRoomsInTableOrder();
        
        allRoomsData.forEach(({ room, blockId, floorId, sectionId }) => {
          if (fillState.targetRooms.has(room.id)) {
            updateRoom(blockId, floorId, sectionId, room.id, { type: fillState.sourceValue });
          }
        });
      }

      setFillState({
        isActive: false,
        sourceRoomId: '',
        sourceValue: '',
        targetRooms: new Set()
      });
    };

    if (fillState.isActive) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [fillState, blocks]);

  const addBlock = () => {
    const newBlock: Block = {
      id: Date.now().toString(),
      name: `Block ${String.fromCharCode(65 + blocks.length)}`,
      floors: []
    };
    setBlocks([...blocks, newBlock]);
  };

  const addFloor = (blockId: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        const newFloor: Floor = {
          id: `${blockId}-${Date.now()}`,
          name: `Floor ${block.floors.length + 1}`,
          sections: []
        };
        return { ...block, floors: [...block.floors, newFloor] };
      }
      return block;
    }));
  };

  const addSection = (blockId: string, floorId: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          floors: block.floors.map(floor => {
            if (floor.id === floorId) {
              const newSection: Section = {
                id: `${floorId}-${Date.now()}`,
                name: `Section ${floor.sections.length + 1}`,
                rooms: []
              };
              return { ...floor, sections: [...floor.sections, newSection] };
            }
            return floor;
          })
        };
      }
      return block;
    }));
  };

  const addRoom = (blockId: string, floorId: string, sectionId: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          floors: block.floors.map(floor => {
            if (floor.id === floorId) {
              return {
                ...floor,
                sections: floor.sections.map(section => {
                  if (section.id === sectionId) {
                    const newRoom: Room = {
                      id: `${sectionId}-${Date.now()}`,
                      number: `${section.rooms.length + 101}`,
                      type: ''
                    };
                    return { ...section, rooms: [...section.rooms, newRoom] };
                  }
                  return section;
                })
              };
            }
            return floor;
          })
        };
      }
      return block;
    }));
  };

  const updateBlockName = (blockId: string, name: string) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, name } : block
    ));
  };

  const updateFloorName = (blockId: string, floorId: string, name: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          floors: block.floors.map(floor =>
            floor.id === floorId ? { ...floor, name } : floor
          )
        };
      }
      return block;
    }));
  };

  const updateSectionName = (blockId: string, floorId: string, sectionId: string, name: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          floors: block.floors.map(floor => {
            if (floor.id === floorId) {
              return {
                ...floor,
                sections: floor.sections.map(section =>
                  section.id === sectionId ? { ...section, name } : section
                )
              };
            }
            return floor;
          })
        };
      }
      return block;
    }));
  };

  const updateRoom = (blockId: string, floorId: string, sectionId: string, roomId: string, updates: Partial<Room>) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          floors: block.floors.map(floor => {
            if (floor.id === floorId) {
              return {
                ...floor,
                sections: floor.sections.map(section => {
                  if (section.id === sectionId) {
                    return {
                      ...section,
                      rooms: section.rooms.map(room =>
                        room.id === roomId ? { ...room, ...updates } : room
                      )
                    };
                  }
                  return section;
                })
              };
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

  const applyTypeToSelected = (type: string) => {
    const allRoomsData = getAllRoomsInTableOrder();
    
    allRoomsData.forEach(({ room, blockId, floorId, sectionId }) => {
      if (selectedRooms.has(room.id)) {
        updateRoom(blockId, floorId, sectionId, room.id, { type });
      }
    });
    setSelectedRooms(new Set());
  };

  const handleFillStart = (roomId: string, value: string) => {
    setFillState({
      isActive: true,
      sourceRoomId: roomId,
      sourceValue: value,
      targetRooms: new Set([roomId])
    });
  };

  const deleteItem = (type: 'block' | 'floor' | 'section' | 'room', ids: string[]) => {
    if (type === 'block') {
      setBlocks(blocks.filter(block => block.id !== ids[0]));
    } else if (type === 'floor') {
      const [blockId, floorId] = ids;
      setBlocks(blocks.map(block => {
        if (block.id === blockId) {
          return {
            ...block,
            floors: block.floors.filter(floor => floor.id !== floorId)
          };
        }
        return block;
      }));
    } else if (type === 'section') {
      const [blockId, floorId, sectionId] = ids;
      setBlocks(blocks.map(block => {
        if (block.id === blockId) {
          return {
            ...block,
            floors: block.floors.map(floor => {
              if (floor.id === floorId) {
                return {
                  ...floor,
                  sections: floor.sections.filter(section => section.id !== sectionId)
                };
              }
              return floor;
            })
          };
        }
        return block;
      }));
    } else if (type === 'room') {
      const [blockId, floorId, sectionId, roomId] = ids;
      setBlocks(blocks.map(block => {
        if (block.id === blockId) {
          return {
            ...block,
            floors: block.floors.map(floor => {
              if (floor.id === floorId) {
                return {
                  ...floor,
                  sections: floor.sections.map(section => {
                    if (section.id === sectionId) {
                      return {
                        ...section,
                        rooms: section.rooms.filter(room => room.id !== roomId)
                      };
                    }
                    return section;
                  })
                };
              }
              return floor;
            })
          };
        }
        return block;
      }));
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl pt-6 px-4 min-w-full">
        {/* Header
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Building Management System</h1>
          <p className="text-gray-600">Excel-like interface with drag-to-fill functionality for room types</p>
        </div> */}

        {selectedRooms.size > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedRooms.size} room{selectedRooms.size > 1 ? 's' : ''} selected
              </span>
              <DropdownSelect
                value=""
                onChange={applyTypeToSelected}
                options={ROOM_TYPES}
                placeholder="Apply room type to selected"
                className="w-64"
                roomId="bulk-select"
              />
              <button
                onClick={() => setSelectedRooms(new Set())}
                className="px-3 py-2 text-sm text-blue-700 hover:text-blue-900"
              >
                Clear selection
              </button>
            </div>
          </div>
        )}

        {/* Add Block Button */}
        <div className="mb-6">
          <button
            onClick={addBlock}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Block
          </button>
        </div>

        {/* Excel-like Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Select</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Block</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Floor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Section</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Room Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Room Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blocks.map((block) => (
                  <React.Fragment key={block.id}>
                    {/* Block Row */}
                    <tr className="bg-blue-50 border-b border-gray-200">
                      <td className="px-4 py-3 border-r border-gray-200"></td>
                      <td className="px-4 py-3 border-r border-gray-200">
                        <div className="flex items-center gap-2">
                          <Building size={16} className="text-blue-600" />
                          <EditableCell
                            value={block.name}
                            onChange={(name) => updateBlockName(block.id, name)}
                            placeholder="Block name"
                            className="font-medium"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-200"></td>
                      <td className="px-4 py-3 border-r border-gray-200"></td>
                      <td className="px-4 py-3 border-r border-gray-200"></td>
                      <td className="px-4 py-3 border-r border-gray-200"></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => addFloor(block.id)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="Add Floor"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => deleteItem('block', [block.id])}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Delete Block"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Floor Rows */}
                    {block.floors.map((floor) => (
                      <React.Fragment key={floor.id}>
                        <tr className="bg-green-50 border-b border-gray-200">
                          <td className="px-4 py-3 border-r border-gray-200"></td>
                          <td className="px-4 py-3 border-r border-gray-200"></td>
                          <td className="px-4 py-3 border-r border-gray-200">
                            <div className="flex items-center gap-2">
                              <Home size={16} className="text-green-600" />
                              <EditableCell
                                value={floor.name}
                                onChange={(name) => updateFloorName(block.id, floor.id, name)}
                                placeholder="Floor name"
                                className="font-medium"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 border-r border-gray-200"></td>
                          <td className="px-4 py-3 border-r border-gray-200"></td>
                          <td className="px-4 py-3 border-r border-gray-200"></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => addSection(block.id, floor.id)}
                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                                title="Add Section"
                              >
                                <Plus size={14} />
                              </button>
                              <button
                                onClick={() => deleteItem('floor', [block.id, floor.id])}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                                title="Delete Floor"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Section Rows */}
                        {floor.sections.map((section) => (
                          <React.Fragment key={section.id}>
                            <tr className="bg-amber-50 border-b border-gray-200">
                              <td className="px-4 py-3 border-r border-gray-200"></td>
                              <td className="px-4 py-3 border-r border-gray-200"></td>
                              <td className="px-4 py-3 border-r border-gray-200"></td>
                              <td className="px-4 py-3 border-r border-gray-200">
                                <div className="flex items-center gap-2">
                                  <Grid3X3 size={16} className="text-amber-600" />
                                  <EditableCell
                                    value={section.name}
                                    onChange={(name) => updateSectionName(block.id, floor.id, section.id, name)}
                                    placeholder="Section name"
                                    className="font-medium"
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-3 border-r border-gray-200"></td>
                              <td className="px-4 py-3 border-r border-gray-200"></td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => addRoom(block.id, floor.id, section.id)}
                                    className="p-1 text-amber-600 hover:bg-amber-100 rounded"
                                    title="Add Room"
                                  >
                                    <Plus size={14} />
                                  </button>
                                  <button
                                    onClick={() => deleteItem('section', [block.id, floor.id, section.id])}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                    title="Delete Section"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Room Rows */}
                            {section.rooms.map((room) => (
                              <tr key={room.id} className="hover:bg-gray-50 border-b border-gray-100">
                                <td className="px-4 py-3 border-r border-gray-200">
                                  <input
                                    type="checkbox"
                                    checked={selectedRooms.has(room.id)}
                                    onChange={() => toggleRoomSelection(room.id)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                </td>
                                <td className="px-4 py-3 border-r border-gray-200"></td>
                                <td className="px-4 py-3 border-r border-gray-200"></td>
                                <td className="px-4 py-3 border-r border-gray-200"></td>
                                <td className="px-4 py-3 border-r border-gray-200">
                                  <EditableCell
                                    value={room.number}
                                    onChange={(number) => updateRoom(block.id, floor.id, section.id, room.id, { number })}
                                    placeholder="Room number"
                                  />
                                </td>
                                <td className="px-4 py-3 border-r border-gray-200">
                                  <DropdownSelect
                                    value={room.type}
                                    onChange={(type) => updateRoom(block.id, floor.id, section.id, room.id, { type })}
                                    options={ROOM_TYPES}
                                    placeholder="Select room type"
                                    roomId={room.id}
                                    onFillStart={handleFillStart}
                                    isFillTarget={fillState.targetRooms.has(room.id)}
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <button
                                    onClick={() => deleteItem('room', [block.id, floor.id, section.id, room.id])}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                    title="Delete Room"
                                  >
                                    <X size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Click on any text to edit • Select multiple rooms to apply room types in bulk • Drag the blue triangle from room type dropdowns to fill down • Use + buttons to add new items
          </p>
        </div>
      </div>
    </div>
  );
}

export default ManageRoomsTableForm;