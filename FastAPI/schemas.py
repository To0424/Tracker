from pydantic import BaseModel

class CoordinateCreate(BaseModel):
    x_axis: float
    y_axis: float