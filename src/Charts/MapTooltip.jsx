import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function Tooltip(props) {
    const { pos, info } = props;

    if (pos === null || info === null) return null;

    const tooltipWidth = 360;
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
    
    const tooltipStyle = {
        position: "absolute",
        left: Math.min(pos.x + 15, windowWidth - tooltipWidth - 20),
        top: pos.y + 15,
    };

    return (
        <div style={tooltipStyle}>
            <Card sx={{ maxWidth: 360 }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {info.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {info.info}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}
export default Tooltip;
