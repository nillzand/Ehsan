# core/management/commands/seed_data.py

import random
from datetime import timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from faker import Faker

# Import all necessary models
from companies.models import Company
from contracts.models import Contract
from menu.models import FoodCategory, FoodItem, SideDish
from orders.models import Order
from schedules.models import Schedule, DailyMenu
from users.models import User
from wallets.models import Wallet, Transaction


class Command(BaseCommand):
    """
    A Django management command to seed the database with realistic test data.
    """
    help = 'Seeds the database with initial data for companies, users, menus, etc.'

    def handle(self, *args, **options):
        self.stdout.write("Starting database seeding...")
        fake = Faker()

        try:
            with transaction.atomic():
                # Keep superusers before clearing other data
                User.objects.exclude(is_superuser=True).delete()

                self.clear_data()  # پاک‌سازی داده‌ها (حالا دیگر کاربران غیر superuser حذف نمی‌شوند)
                self.create_menu_items()
                self.create_super_admin()

                # Create 1 companies with all related data
                for i in range(1):
                    self.create_company_and_related_data(i + 1, fake)

                self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An error occurred during seeding: {e}"))

    def clear_data(self):
        """ Clears all data from the relevant models. """
        self.stdout.write("Clearing existing data...")
        Order.objects.all().delete()
        DailyMenu.objects.all().delete()
        Schedule.objects.all().delete()
        Transaction.objects.all().delete()
        Contract.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()  # Keep superusers
        Wallet.objects.all().delete()
        Company.objects.all().delete()
        SideDish.objects.all().delete()
        FoodItem.objects.all().delete()
        FoodCategory.objects.all().delete()

    def create_menu_items(self):
        """ Creates food categories, food items, and side dishes. """
        self.stdout.write("Creating menu items...")

        # Food Categories
        main_course_cat = FoodCategory.objects.create(name="Main Course", description="Delicious main dishes.")
        dessert_cat = FoodCategory.objects.create(name="Dessert", description="Sweet treats to end your meal.")

        # Food Items
        self.food_items = [
            FoodItem.objects.create(name="Grilled Chicken", description="Juicy grilled chicken breast with herbs.", price=Decimal('12.50'), category=main_course_cat),
            FoodItem.objects.create(name="Beef Lasagna", description="Classic lasagna with beef and cheese.", price=Decimal('14.00'), category=main_course_cat),
            FoodItem.objects.create(name="Vegetable Curry", description="Aromatic vegetable curry with rice.", price=Decimal('11.00'), category=main_course_cat),
            FoodItem.objects.create(name="Chocolate Cake", description="Rich and moist chocolate cake.", price=Decimal('5.50'), category=dessert_cat),
        ]

        # Side Dishes
        self.side_dishes = [
            SideDish.objects.create(name="Garden Salad", description="Fresh mixed greens with vinaigrette.", price=Decimal('3.50')),
            SideDish.objects.create(name="Garlic Bread", description="Warm and crispy garlic bread.", price=Decimal('2.50')),
            SideDish.objects.create(name="Mineral Water", description="Bottled mineral water.", price=Decimal('1.50')),
        ]

    def create_super_admin(self):
        """ Ensures a super admin user exists. """
        if not User.objects.filter(username="superadmin").exists():
            self.stdout.write("Creating Super Admin...")
            User.objects.create_superuser(
                username="superadmin",
                email="superadmin@example.com",
                password="superpassword123",
                role=User.Role.SUPER_ADMIN
            )

    def create_company_and_related_data(self, index, fake):
        """ Creates a company with all associated data. """
        self.stdout.write(f"Creating data for Company {index}...")

        # 1. Create Company
        company_name = f"Company {fake.company()}"
        company = Company.objects.create(
            name=company_name,
            contact_person=fake.name(),
            contact_phone=fake.phone_number(),
            address=fake.address()
        )

        # 2. Create Contract
        today = timezone.now().date()
        Contract.objects.create(
            company=company,
            start_date=today - timedelta(days=30),
            end_date=today + timedelta(days=365),
            status=Contract.ContractStatus.ACTIVE
        )

        # 3. Fund Company Wallet
        wallet = company.wallet
        deposit_amount = Decimal('5000.00')
        wallet.balance = deposit_amount
        wallet.save()

        super_admin = User.objects.get(username="superadmin")
        Transaction.objects.create(
            wallet=wallet,
            user=super_admin,
            transaction_type=Transaction.TransactionType.DEPOSIT,
            amount=deposit_amount,
            description=f"Initial seed deposit by {super_admin.username}."
        )

        # 4. Create Users
        company_admin = User.objects.create_user(
            username=f"admin_{company.name.lower().replace(' ', '')[:10]}",
            password="password123",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            email=f"admin@{company.name.lower().replace(' ', '')}.com",
            role=User.Role.COMPANY_ADMIN,
            company=company
        )

        employees = []
        for i in range(5):
            employee = User.objects.create_user(
                username=f"employee{i}_{company.name.lower().replace(' ', '')[:8]}",
                password="password123",
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=f"emp{i}@{company.name.lower().replace(' ', '')}.com",
                role=User.Role.EMPLOYEE,
                company=company
            )
            employees.append(employee)

        # 5. Allocate Budget to Employees
        allocation_amount = Decimal('150.00')
        for employee in employees:
            wallet.balance -= allocation_amount
            employee.budget += allocation_amount

            Transaction.objects.create(
                wallet=wallet,
                user=company_admin,
                transaction_type=Transaction.TransactionType.BUDGET_ALLOCATION,
                amount=-allocation_amount,
                description=f"Allocation to {employee.username} by {company_admin.username}."
            )

            Transaction.objects.create(
                wallet=wallet,
                user=employee,
                transaction_type=Transaction.TransactionType.BUDGET_ALLOCATION,
                amount=allocation_amount,
                description=f"Budget allocated by {company_admin.username}."
            )

        wallet.save()
        for emp in employees:
            emp.save()

        # 6. Create Schedule and Daily Menus
        schedule = Schedule.objects.create(
            name=f"{company.name} Monthly Schedule",
            company=company,
            start_date=today.replace(day=1),
            end_date=(today.replace(day=1) + timedelta(days=32)).replace(day=1) - timedelta(days=1),
            is_active=True
        )

        current_date = schedule.start_date
        while current_date <= schedule.end_date:
            daily_menu = DailyMenu.objects.create(schedule=schedule, date=current_date)
            daily_menu.available_foods.set(random.sample(self.food_items, k=2))
            daily_menu.available_sides.set(random.sample(self.side_dishes, k=2))
            current_date += timedelta(days=1)

        # 7. Create Past Orders
        past_menus = DailyMenu.objects.filter(schedule=schedule, date__lt=today).order_by('?')
        for employee in random.sample(employees, k=3):
            for menu in past_menus[:5]:
                food_item = menu.available_foods.first()
                side_dish = menu.available_sides.first()
                total_cost = food_item.price + (side_dish.price if side_dish else Decimal('0.00'))

                if employee.budget >= total_cost:
                    order = Order.objects.create(
                        user=employee,
                        daily_menu=menu,
                        food_item=food_item,
                        status=random.choice([Order.OrderStatus.DELIVERED, Order.OrderStatus.CONFIRMED])
                    )
                    if side_dish:
                        order.side_dishes.add(side_dish)

                    # Update employee budget and wallet transactions
                    employee.budget -= total_cost
                    employee.save()

                    Transaction.objects.create(
                        wallet=wallet,
                        user=employee,
                        transaction_type=Transaction.TransactionType.ORDER_DEDUCTION,
                        amount=-total_cost,
                        description=f"Deduction for Order #{order.id}"
                    )
