import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";
import Typography from "@mui/joy/Typography";

export default function DashboardCard({
  title,
  value,
  progress,
}) {
  return (
    <Card
      variant="solid"
      color="primary"
      invertedColors
      sx={{
        minHeight: 180,
        borderRadius: "20px",
      }}
    >
      <CardContent
        orientation="horizontal"
        sx={{
          justifyContent: "space-between",
        }}
      >
        <div>
          <Typography level="body-md">
            {title}
          </Typography>

          <Typography level="h2">
            {value}
          </Typography>
        </div>

        <CircularProgress
          determinate
          value={progress}
          size="lg"
        >
          {Math.round(progress)}%
        </CircularProgress>
      </CardContent>
    </Card>
  );
}