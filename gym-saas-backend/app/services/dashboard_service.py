from sqlalchemy import func

from app.models.member import Member
from app.models.plan import Plan
from app.models.subscription import Subscription
from app.models.payment import Payment
from app.models.attendance import Attendance


class DashboardService:

    @staticmethod
    def get_stats(db):

        total_members = db.query(
            func.count(Member.id)
        ).scalar()

        total_plans = db.query(
            func.count(Plan.id)
        ).scalar()

        active_subscriptions = db.query(
            func.count(Subscription.id)
        ).filter(
            Subscription.status == "active"
        ).scalar()

        total_payments = db.query(
            func.count(Payment.id)
        ).scalar()

        monthly_revenue = db.query(
            func.coalesce(
                func.sum(Payment.amount),
                0
            )
        ).scalar()

        members_inside_gym = db.query(
            func.count(Attendance.id)
        ).filter(
            Attendance.check_out_time.is_(None)
        ).scalar()

        return {
            "total_members": total_members,
            "total_plans": total_plans,
            "active_subscriptions": active_subscriptions,
            "total_payments": total_payments,
            "monthly_revenue": float(monthly_revenue),
            "members_inside_gym": members_inside_gym
        }