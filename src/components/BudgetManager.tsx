
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CurrencySelector from './CurrencySelector';
import { 
  Plus, 
  DollarSign, 
  ShoppingCart, 
  Home, 
  Car, 
  Utensils, 
  Gamepad2, 
  GraduationCap,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Calendar,
  PieChart,
  Wallet,
  IndianRupee
} from 'lucide-react';

interface BudgetCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

interface Expense {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  description: string;
  date: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}

interface BudgetManagerProps {
  userId: string;
  onStatsUpdate: () => void;
}

const iconMap = {
  DollarSign,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Gamepad2,
  GraduationCap,
  IndianRupee,
};

const BudgetManager = ({ userId, onStatsUpdate }: BudgetManagerProps) => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currency, setCurrency] = useState('USD');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    color: '#3B82F6',
    icon: 'DollarSign'
  });

  const [budgetForm, setBudgetForm] = useState({
    category_id: '',
    amount: '',
    period: 'monthly',
    start_date: '',
    end_date: ''
  });

  const [expenseForm, setExpenseForm] = useState({
    category_id: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchCategories();
    fetchBudgets();
    fetchExpenses();
    
    // Load saved currency
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, [userId]);

  const getCurrencySymbol = () => {
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'INR': '₹',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥'
    };
    return symbols[currency] || '$';
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('budget_categories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBudgets(data || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast.error('Failed to fetch budgets');
    }
  };

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to fetch expenses');
    }
  };

  const handleAddCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('budget_categories')
        .insert([{
          ...categoryForm,
          user_id: userId
        }])
        .select();

      if (error) throw error;

      setCategories([data[0], ...categories]);
      setCategoryForm({ name: '', color: '#3B82F6', icon: 'DollarSign' });
      setIsAddingCategory(false);
      toast.success('Category added successfully');
      onStatsUpdate();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleAddBudget = async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert([{
          ...budgetForm,
          amount: parseFloat(budgetForm.amount),
          user_id: userId
        }])
        .select();

      if (error) throw error;

      setBudgets([data[0], ...budgets]);
      setBudgetForm({ category_id: '', amount: '', period: 'monthly', start_date: '', end_date: '' });
      setIsAddingBudget(false);
      toast.success('Budget added successfully');
      onStatsUpdate();
    } catch (error) {
      console.error('Error adding budget:', error);
      toast.error('Failed to add budget');
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setBudgetForm({
      category_id: budget.category_id,
      amount: budget.amount.toString(),
      period: budget.period,
      start_date: budget.start_date,
      end_date: budget.end_date
    });
    setEditingBudgetId(budget.id);
    setIsEditingBudget(true);
  };

  const handleUpdateBudget = async () => {
    if (!editingBudgetId) return;

    try {
      const { data, error } = await supabase
        .from('budgets')
        .update({
          ...budgetForm,
          amount: parseFloat(budgetForm.amount)
        })
        .eq('id', editingBudgetId)
        .select();

      if (error) throw error;

      setBudgets(budgets.map(b => b.id === editingBudgetId ? data[0] : b));
      setBudgetForm({ category_id: '', amount: '', period: 'monthly', start_date: '', end_date: '' });
      setIsEditingBudget(false);
      setEditingBudgetId(null);
      toast.success('Budget updated successfully');
      onStatsUpdate();
    } catch (error) {
      console.error('Error updating budget:', error);
      toast.error('Failed to update budget');
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId);

      if (error) throw error;

      setBudgets(budgets.filter(b => b.id !== budgetId));
      toast.success('Budget deleted successfully');
      onStatsUpdate();
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to delete budget');
    }
  };

  const handleAddExpense = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          ...expenseForm,
          amount: parseFloat(expenseForm.amount),
          user_id: userId
        }])
        .select();

      if (error) throw error;

      setExpenses([data[0], ...expenses]);
      setExpenseForm({ category_id: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
      setIsAddingExpense(false);
      toast.success('Expense added successfully');
      onStatsUpdate();
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;

      setExpenses(expenses.filter(e => e.id !== expenseId));
      toast.success('Expense deleted successfully');
      onStatsUpdate();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const getBudgetProgress = (categoryId: string) => {
    const budget = budgets.find(b => b.category_id === categoryId);
    if (!budget) return { spent: 0, total: 0, percentage: 0 };

    const spent = expenses
      .filter(e => e.category_id === categoryId)
      .reduce((sum, e) => sum + e.amount, 0);

    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    
    return { spent, total: budget.amount, percentage };
  };

  const getCategoryIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || DollarSign;
    return IconComponent;
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      {/* Currency Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Budget Manager
        </h2>
        <CurrencySelector currency={currency} onCurrencyChange={handleCurrencyChange} />
      </div>

      {/* Enhanced Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950 dark:via-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Budget</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {getCurrencySymbol()}{totalBudget.toFixed(2)}
                </p>
              </div>
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <PieChart className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 via-red-100 to-red-200 dark:from-red-950 dark:via-red-900 dark:to-red-800 border-red-200 dark:border-red-700">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Total Spent</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                  {getCurrencySymbol()}{totalSpent.toFixed(2)}
                </p>
              </div>
              <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingDown className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 via-green-100 to-green-200 dark:from-green-950 dark:via-green-900 dark:to-green-800 border-green-200 dark:border-green-700">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Remaining</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {getCurrencySymbol()}{totalRemaining.toFixed(2)}
                </p>
              </div>
              <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-12 rounded-xl bg-muted/50">
          <TabsTrigger value="overview" className="rounded-lg font-medium">Overview</TabsTrigger>
          <TabsTrigger value="categories" className="rounded-lg font-medium">Categories</TabsTrigger>
          <TabsTrigger value="budgets" className="rounded-lg font-medium">Budgets</TabsTrigger>
          <TabsTrigger value="expenses" className="rounded-lg font-medium">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            {categories.map(category => {
              const progress = getBudgetProgress(category.id);
              const IconComponent = getCategoryIcon(category.icon);
              
              return (
                <Card key={category.id} className="hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-background to-muted/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: category.color }}
                        >
                          <IconComponent className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{category.name}</h3>
                          <p className="text-muted-foreground">
                            {getCurrencySymbol()}{progress.spent.toFixed(2)} of {getCurrencySymbol()}{progress.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={progress.percentage > 90 ? "destructive" : progress.percentage > 75 ? "default" : "secondary"}
                        className="text-sm px-3 py-1"
                      >
                        {progress.percentage.toFixed(0)}%
                      </Badge>
                    </div>
                    <Progress value={progress.percentage} className="h-3 rounded-full" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Budget Plans</h3>
            <Dialog open={isAddingBudget} onOpenChange={setIsAddingBudget}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Budget
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Budget Plan</DialogTitle>
                  <DialogDescription>
                    Set a budget limit for a category
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="budget-category">Category</Label>
                    <Select
                      value={budgetForm.category_id}
                      onValueChange={(value) => setBudgetForm({...budgetForm, category_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="budget-amount">Amount ({getCurrencySymbol()})</Label>
                    <Input
                      id="budget-amount"
                      type="number"
                      step="0.01"
                      value={budgetForm.amount}
                      onChange={(e) => setBudgetForm({...budgetForm, amount: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget-period">Period</Label>
                    <Select
                      value={budgetForm.period}
                      onValueChange={(value) => setBudgetForm({...budgetForm, period: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget-start">Start Date</Label>
                      <Input
                        id="budget-start"
                        type="date"
                        value={budgetForm.start_date}
                        onChange={(e) => setBudgetForm({...budgetForm, start_date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="budget-end">End Date</Label>
                      <Input
                        id="budget-end"
                        type="date"
                        value={budgetForm.end_date}
                        onChange={(e) => setBudgetForm({...budgetForm, end_date: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddBudget} className="w-full">
                    Add Budget
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6">
            {budgets.map(budget => {
              const category = categories.find(c => c.id === budget.category_id);
              const progress = getBudgetProgress(budget.category_id);
              
              return (
                <Card key={budget.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium">{category?.name}</h4>
                        <p className="text-muted-foreground">
                          {getCurrencySymbol()}{budget.amount.toFixed(2)} {budget.period}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={progress.percentage > 90 ? "destructive" : "secondary"}>
                          {progress.percentage.toFixed(0)}% used
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBudget(budget)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBudget(budget.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Progress value={progress.percentage} className="mb-2 h-2" />
                    <p className="text-sm text-muted-foreground">
                      {getCurrencySymbol()}{progress.spent.toFixed(2)} spent of {getCurrencySymbol()}{budget.amount.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Edit Budget Dialog */}
          <Dialog open={isEditingBudget} onOpenChange={setIsEditingBudget}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Budget Plan</DialogTitle>
                <DialogDescription>
                  Update your budget settings
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-budget-amount">Amount ({getCurrencySymbol()})</Label>
                  <Input
                    id="edit-budget-amount"
                    type="number"
                    step="0.01"
                    value={budgetForm.amount}
                    onChange={(e) => setBudgetForm({...budgetForm, amount: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-budget-period">Period</Label>
                  <Select
                    value={budgetForm.period}
                    onValueChange={(value) => setBudgetForm({...budgetForm, period: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-budget-start">Start Date</Label>
                    <Input
                      id="edit-budget-start"
                      type="date"
                      value={budgetForm.start_date}
                      onChange={(e) => setBudgetForm({...budgetForm, start_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-budget-end">End Date</Label>
                    <Input
                      id="edit-budget-end"
                      type="date"
                      value={budgetForm.end_date}
                      onChange={(e) => setBudgetForm({...budgetForm, end_date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleUpdateBudget} className="flex-1">
                    Update Budget
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditingBudget(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Categories and Expenses tabs remain largely the same but with enhanced styling */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Budget Categories</h3>
            <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Budget Category</DialogTitle>
                  <DialogDescription>
                    Create a new category to organize your budget
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category-name">Name</Label>
                    <Input
                      id="category-name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      placeholder="e.g., Food, Transportation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category-icon">Icon</Label>
                    <Select
                      value={categoryForm.icon}
                      onValueChange={(value) => setCategoryForm({...categoryForm, icon: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DollarSign">💰 Money</SelectItem>
                        <SelectItem value="IndianRupee">₹ Rupee</SelectItem>
                        <SelectItem value="ShoppingCart">🛒 Shopping</SelectItem>
                        <SelectItem value="Home">🏠 Home</SelectItem>
                        <SelectItem value="Car">🚗 Transportation</SelectItem>
                        <SelectItem value="Utensils">🍽️ Food</SelectItem>
                        <SelectItem value="Gamepad2">🎮 Entertainment</SelectItem>
                        <SelectItem value="GraduationCap">🎓 Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category-color">Color</Label>
                    <Input
                      id="category-color"
                      type="color"
                      value={categoryForm.color}
                      onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleAddCategory} className="w-full">
                    Add Category
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {categories.map(category => {
              const IconComponent = getCategoryIcon(category.icon);
              return (
                <Card key={category.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="h-12 w-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: category.color }}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Created {new Date(category.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Recent Expenses</h3>
            <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Expense</DialogTitle>
                  <DialogDescription>
                    Record a new expense
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="expense-category">Category</Label>
                    <Select
                      value={expenseForm.category_id}
                      onValueChange={(value) => setExpenseForm({...expenseForm, category_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="expense-amount">Amount ({getCurrencySymbol()})</Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      step="0.01"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expense-description">Description</Label>
                    <Input
                      id="expense-description"
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                      placeholder="What did you spend on?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expense-date">Date</Label>
                    <Input
                      id="expense-date"
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleAddExpense} className="w-full">
                    Add Expense
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {expenses.map(expense => {
              const category = categories.find(c => c.id === expense.category_id);
              const IconComponent = getCategoryIcon(category?.icon || 'DollarSign');
              
              return (
                <Card key={expense.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="h-12 w-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: category?.color || '#3B82F6' }}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{expense.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          {category?.name} • {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <p className="font-semibold text-red-600">
                        -{getCurrencySymbol()}{expense.amount.toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetManager;
