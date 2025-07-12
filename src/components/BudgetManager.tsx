
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
  PieChart
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
};

const BudgetManager = ({ userId, onStatsUpdate }: BudgetManagerProps) => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
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
  }, [userId]);

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
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Budget</p>
                <p className="text-2xl font-bold text-blue-900">${totalBudget.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                <PieChart className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Total Spent</p>
                <p className="text-2xl font-bold text-red-900">${totalSpent.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 bg-red-500 rounded-full flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Remaining</p>
                <p className="text-2xl font-bold text-green-900">${totalRemaining.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {categories.map(category => {
              const progress = getBudgetProgress(category.id);
              const IconComponent = getCategoryIcon(category.icon);
              
              return (
                <Card key={category.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="h-10 w-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: category.color }}
                        >
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${progress.spent.toFixed(2)} of ${progress.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={progress.percentage > 90 ? "destructive" : progress.percentage > 75 ? "default" : "secondary"}>
                        {progress.percentage.toFixed(0)}%
                      </Badge>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Budget Categories</h3>
            <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
              <DialogTrigger asChild>
                <Button>
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
                <Card key={category.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category.color }}
                      >
                        <IconComponent className="h-5 w-5 text-white" />
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

        <TabsContent value="budgets" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Budget Plans</h3>
            <Dialog open={isAddingBudget} onOpenChange={setIsAddingBudget}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Budget
                </Button>
              </DialogTrigger>
              <DialogContent>
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
                    <Label htmlFor="budget-amount">Amount</Label>
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

          <div className="grid gap-4">
            {budgets.map(budget => {
              const category = categories.find(c => c.id === budget.category_id);
              const progress = getBudgetProgress(budget.category_id);
              
              return (
                <Card key={budget.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{category?.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${budget.amount.toFixed(2)} {budget.period}
                        </p>
                      </div>
                      <Badge variant={progress.percentage > 90 ? "destructive" : "secondary"}>
                        {progress.percentage.toFixed(0)}% used
                      </Badge>
                    </div>
                    <Progress value={progress.percentage} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      ${progress.spent.toFixed(2)} spent of ${budget.amount.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Expenses</h3>
            <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
              <DialogTrigger asChild>
                <Button>
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
                    <Label htmlFor="expense-amount">Amount</Label>
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
                <Card key={expense.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category?.color || '#3B82F6' }}
                      >
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{expense.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          {category?.name} • {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">-${expense.amount.toFixed(2)}</p>
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
