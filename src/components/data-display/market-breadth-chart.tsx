import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer, 
} from 'recharts';

// Dữ liệu mẫu dựa trên hình ảnh của bạn
const data = [
  { name: 'Tài chính', value: 2.6 },
  { name: 'Ngân hàng', value: 1.7 },
  { name: 'Nguyên vật liệu', value: 1.3 },
  { name: 'Hàng tiêu dùng', value: 0.2 },
  { name: 'Dịch vụ Tiêu dùng', value: 0.2 },
  { name: 'Công nghiệp', value: 0.1 },
  { name: 'Dược phẩm và Y tế', value: -0.1 },
  { name: 'Viễn thông', value: -0.2 },
  { name: 'Dầu khí', value: -0.5 },
  { name: 'Tiện ích Cộng đồng', value: -0.6 },
  { name: 'Công nghệ Thông tin', value: -1.1 },
];

export default function MarketBreadthChart() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Độ rộng thị trường
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Mô tả về độ rộng thị trường
        </p>
      </CardHeader>
      <CardContent>
        {/* 2. Bọc BarChart bằng ResponsiveContainer và đặt chiều cao ở đây */}
        <ResponsiveContainer width="100%" height={360}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 0,
              right: 0,
              left: 0, 
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[-1.5, 3]} tickFormatter={(tick) => `${tick}%`} />
            <YAxis type="category" fontSize={'13'} dataKey="name" width={160} />
            <Tooltip formatter={(value) => `${value}%`} />
            {/* <Legend /> */}
            {/* <ReferenceLine x={0} stroke="#666" /> */}
            <Bar dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#28a745' : '#dc3545'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}