"use client";

import {
  updateDefaultAccount,
  updateAccount,
  deleteAccount,
} from "@/actions/accounts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/use-fetch";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Pencil,
  X,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AccountCard = ({ account, isSingleAccount = false }) => {
  const { name, type, balance, id, isDefault } = account;
  const [isEditing, setIsEditing] = useState(false);
  const [accountName, setAccountName] = useState(name);

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const {
    loading: updateAccountLoading,
    fn: updateAccountFn,
    data: updatedAccountData,
    error: updateAccountError,
  } = useFetch(updateAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();

    if (isDefault) {
      toast.warning("You need at least one default account.");
      return;
    }

    await updateDefaultFn(id);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
    setAccountName(name);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!accountName.trim()) {
      toast.error("Account name cannot be empty");
      return;
    }

    await updateAccountFn(id, { name: accountName });
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully!");
    }
  }, [updatedAccount, updateDefaultLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  useEffect(() => {
    if (updatedAccountData?.success) {
      toast.success("Account name updated successfully!");
      setIsEditing(false);
    }
  }, [updatedAccountData]);

  useEffect(() => {
    if (updateAccountError) {
      toast.error(
        updateAccountError.message || "Failed to update account name"
      );
    }
  }, [updateAccountError]);

  const {
    loading: deleteAccountLoading,
    fn: deleteAccountFn,
    data: deletedAccount,
    error: deleteAccountError,
  } = useFetch(deleteAccount);

  const handleDelete = async (e) => {
    e.preventDefault();

    if (isSingleAccount) {
      if (
        !window.confirm(
          "Are you sure you want to delete your only and default account?"
        )
      ) {
        return;
      }
    } else {
      if (!window.confirm("Are you sure you want to delete this account?")) {
        return;
      }
    }

    await deleteAccountFn(id);
  };

  useEffect(() => {
    if (deletedAccount?.success) {
      toast.success("Account deleted successfully");
    }
    if (deletedAccount?.error) {
      toast.error(deletedAccount.error || "Failed to delete account");
    }
  }, [deletedAccount]);

  useEffect(() => {
    if (deleteAccountError) {
      toast.error(deleteAccountError.message || "Failed to delete account");
    }
  }, [deleteAccountError]);

  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
            {isEditing ? (
              <div
                className="flex items-center gap-2"
                onClick={(e) => e.preventDefault()}
              >
                <Input
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="h-7 w-32"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleSave}
                  disabled={updateAccountLoading}
                >
                  <Check className="h-3 w-3 text-green-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleCancel}
                  disabled={updateAccountLoading}
                >
                  <X className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                {name}
                <div onClick={handleEdit}>
                  <Pencil className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                </div>
              </>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deleteAccountLoading}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
            <Switch
              checked={isDefault}
              onClick={handleDefaultChange}
              disabled={updateDefaultLoading}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            BDT {parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground mt-4">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default AccountCard;
