"use client";

import React from "react";
import { FaTrash, FaExclamationTriangle } from "react-icons/fa";

import { CommonModal } from "@/components";

interface DeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  itemTitle?: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onConfirm,
  onClose,
  itemTitle,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <CommonModal
      actionBtnName="Delete Item"
      actionBtnProps={{
        color: "danger",
        className:
          "bg-red-500 hover:bg-red-600 focus:ring-red-300 transition-all duration-200",
        startContent: <FaTrash className="mr-2" size={16} />,
      }}
      btnProps={{ className: "hidden" }}
      isOpen={isOpen}
      title={
        <div className="grid place-items-center gap-4 py-2">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
            <FaExclamationTriangle className="text-red-500" size={24} />
          </div>
          <div className="text-center space-y-2">
            <div className="font-semibold text-lg text-gray-900">
              Delete Item
            </div>
            {itemTitle && (
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md max-w-xs truncate">
                &ldquo;{itemTitle}&rdquo;
              </div>
            )}
            <div className="text-sm text-gray-500 max-w-sm">
              This item and all its child nodes will be permanently deleted.
              This action cannot be undone.
            </div>
          </div>
        </div>
      }
      onActionClick={handleConfirm}
      onOpenChange={onClose}
    />
  );
};
