import { ItemType } from "@/types/new-types";

export type InlineEditableTextProps = {
  text: string;
  className?: string;
  onTextChange: (newText: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isEditing?: boolean;
  isChildNode?: boolean;
  nodeId?: string;
  itemId?: string;
  onEditStart?: (
    nodeId?: string,
    itemId?: string,
    currentText?: string,
  ) => void;
  onEditEnd?: () => void;
};

export type MarkdownTextRendererProps = {
  text: string;
  className?: string;
  onTextChange?: (newText: string) => void;
  isEditable?: boolean;
};

export type NodeHeaderProps = {
  title: string;
  nodeId?: string;
  nodesDraggable: boolean;
  draggingId: string | null;
  isItemBeingDragged: boolean;
  onTitleChange?: (newTitle: string) => void;
};

export type ReorderableItemProps = {
  isActive: boolean;
  isChild: boolean;
  isDragging: boolean;
  isEditing?: boolean;
  isHover: boolean;
  item: ItemType;
  itemIndex: number;
  nodeId: string;
  nodesDraggable: boolean;
  onAddItem: (afterItemId: string) => void;
  onCheckboxClick: (item: ItemType) => void;
  onClick: (item: ItemType) => void;
  onDelete: (id: string) => void;
  onDragEnd: () => void;
  onDragStart: (id: string) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
  onTextChange: (itemId: string, newText: string) => void;
  onEditStart?: (
    nodeId?: string,
    itemId?: string,
    currentText?: string,
  ) => void;
  onEditEnd?: () => void;
};

export type ReorderableListProps = {
  items: ItemType[];
  nodesDraggable: boolean;
  handleReorder: (newOrder: ItemType[]) => void;
  globalSelectedItemId: string | null;
  nodeId?: string;
  parentId?: string;
  draggingId: string | null;
  hoverId: string | null;
  editingItemId?: string | null;
  handleCheckboxClick: (item: ItemType) => void;
  handleClick: (item: ItemType) => void;
  setDeleteModalItem: (
    item: { id?: string | unknown; itemId: string } | null,
  ) => void;
  handleDragEnd: () => void;
  handleDragStart: (id: string) => void;
  setHoverId: (id: string) => void;
  onMouseLeave: () => void;
  onTextChange: (itemId: string, newText: string) => void;
  onEditStart?: (
    nodeId?: string,
    itemId?: string,
    currentText?: string,
  ) => void;
  onEditEnd?: () => void;
  onAddItem: (afterItemId: string) => void;
};
