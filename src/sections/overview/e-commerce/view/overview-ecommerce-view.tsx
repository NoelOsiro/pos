'use client';

import { useEffect } from 'react';

import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

import { DashboardContent } from '@/layouts/dashboard';
import { MotivationIllustration } from '@/assets/illustrations';
import { useDashStore } from '@/store/dashboardStore';
import { paths } from '@/routes/paths';
import type { PosDashboardData } from '@/types/dashboard';

import { EcommerceWelcome } from '../ecommerce-welcome';
import { EcommerceNewProducts } from '../ecommerce-new-products';
import { EcommerceYearlySales } from '../ecommerce-yearly-sales';
import { EcommerceBestSalesman } from '../ecommerce-best-salesman';
import { EcommerceSaleByGender } from '../ecommerce-sale-by-gender';
import { EcommerceSalesOverview } from '../ecommerce-sales-overview';
import { EcommerceWidgetSummary } from '../ecommerce-widget-summary';
import { EcommerceLatestProducts } from '../ecommerce-latest-products';
import { EcommerceCurrentBalance } from '../ecommerce-current-balance';

// ----------------------------------------------------------------------

type Props = {
  initialData: PosDashboardData;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function OverviewEcommerceView({ initialData }: Props) {
  const theme = useTheme();
  const storedDashboard = useDashStore((state) => state.posDashboard);
  const setPosDashboard = useDashStore((state) => state.setPosDashboard);
  const dashboardData =
    storedDashboard?.snapshotId === initialData.snapshotId ? storedDashboard : initialData;
  const totalSales = dashboardData.summary.grossSales;
  const salesShare = (value: number) => (totalSales ? (value / totalSales) * 100 : 0);

  useEffect(() => {
    setPosDashboard(initialData);
  }, [initialData, setPosDashboard]);

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <EcommerceWelcome
            title={`Welcome to ${dashboardData.shopName}\n${dashboardData.userName || 'Your POS dashboard'}`}
            description={`Signed in as ${dashboardData.role}. Review your shop's inventory and completed sales.`}
            img={<MotivationIllustration hideBackground />}
            action={
              <Button href={paths.dashboard.inventory.list} variant="contained" color="primary">
                Manage inventory
              </Button>
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <EcommerceNewProducts
            list={dashboardData.latestProducts.slice(0, 3).map((product) => ({
              ...product,
              href: paths.dashboard.inventory.details(product.id),
            }))}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <EcommerceWidgetSummary
            title="Items sold"
            total={dashboardData.summary.itemsSold}
            comparisonLabel="Completed sales"
            chart={{
              categories: MONTHS,
              series: dashboardData.monthly.itemsSold,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <EcommerceWidgetSummary
            title="Gross product sales"
            total={dashboardData.summary.grossSales}
            format="currency"
            comparisonLabel="Monthly trend this year"
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              categories: MONTHS,
              series: dashboardData.monthly.revenue,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <EcommerceWidgetSummary
            title="Completed orders"
            total={dashboardData.summary.completedOrders}
            comparisonLabel="Completed orders"
            chart={{
              colors: [theme.palette.error.light, theme.palette.error.main],
              categories: MONTHS,
              series: dashboardData.monthly.orders,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <EcommerceSaleByGender
            title="Sales by category"
            subheader="Share of year-to-date units sold"
            total={dashboardData.summary.yearItemsSold}
            chart={{
              series: dashboardData.categorySales.map((item) => item),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <EcommerceYearlySales
            title="Sales this year"
            subheader="Monthly gross product sales from completed orders"
            chart={{
              categories: MONTHS,
              series: [
                {
                  name: String(new Date(dashboardData.fetchedAt).getUTCFullYear()),
                  data: [
                    {
                      name: 'Gross product sales',
                      data: dashboardData.monthly.revenue,
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <EcommerceSalesOverview
            title="Sales overview"
            subheader="Share of all-time gross product sales"
            data={[
              {
                label: 'All-time sales',
                totalAmount: totalSales,
                value: salesShare(totalSales),
                format: 'currency',
              },
              {
                label: 'Sales this year',
                totalAmount: dashboardData.summary.yearRevenue,
                value: salesShare(dashboardData.summary.yearRevenue),
                format: 'currency',
              },
              {
                label: 'Sales today',
                totalAmount: dashboardData.summary.todayRevenue,
                value: salesShare(dashboardData.summary.todayRevenue),
                format: 'currency',
              },
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <EcommerceCurrentBalance
            title="Estimated inventory retail value"
            currentBalance={dashboardData.summary.retailValue}
            rows={[
              { label: 'Products', value: dashboardData.summary.productCount, format: 'number' },
              { label: 'Units in stock', value: dashboardData.summary.stockUnits, format: 'number' },
              { label: 'Low-stock products', value: dashboardData.summary.lowStockProducts, format: 'number' },
            ]}
            primaryAction={{ label: 'Inventory', href: paths.dashboard.inventory.list }}
            secondaryAction={{ label: 'Orders', href: paths.dashboard.order.root }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <EcommerceBestSalesman
            title={dashboardData.role === 'cashier' ? 'My sales' : 'Top staff by product sales'}
            showCountry={false}
            tableData={dashboardData.sellers.map((seller) => ({
              id: seller.id,
              name: seller.name,
              rank: seller.rank,
              email: seller.email,
              category: seller.role,
              avatarUrl: seller.avatarUrl,
              countryCode: '',
              totalAmount: seller.sales,
              orders: seller.orders,
            }))}
            headCells={[
              { id: 'name', label: 'Seller' },
              { id: 'category', label: 'Role' },
              { id: 'orders', label: 'Completed orders', align: 'center' },
              { id: 'totalAmount', label: 'Sales', align: 'right' },
              { id: 'rank', label: 'Rank', align: 'right' },
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <EcommerceLatestProducts
            title="Latest products"
            list={dashboardData.latestProducts.map((product) => ({
              ...product,
              priceSale: 0,
              colors: [],
            }))}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
