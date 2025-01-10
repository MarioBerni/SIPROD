import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';

interface VertexContextMenuProps {
  x: number;
  y: number;
  onDelete: () => void;
  onClose: () => void;
}

const MenuContainer = styled.div<{ x: number; y: number }>`
  position: fixed;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  padding: 4px 0;
  z-index: 1500;
  min-width: 120px;
`;

const MenuItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #d32f2f;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0,0,0,0.04);
  }
`;

export function VertexContextMenu({ x, y, onDelete, onClose }: VertexContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <MenuContainer ref={menuRef} x={x} y={y}>
      <MenuItem onClick={onDelete}>
        Eliminar punto
      </MenuItem>
    </MenuContainer>
  );
}
