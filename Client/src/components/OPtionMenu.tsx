import React, { useState } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
export interface Opt {
  id: number;
  title: string;
  func:(id?:number)=>void;
  child?: Opt[];  // new optional field to identify special items
  icon?: React.ElementType; // optional icon property
}

interface OptionsMenuProps {
  options:Opt[]
  
}

const OptionsMenu = (options:OptionsMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} >
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.options.map((opt) => (
          <MenuItem
            key={opt.id}
            onClick={(event) => {
              event.stopPropagation(); // למנוע סגירה אוטומטית של התפריט אם יש תפריט משנה
              opt.func(opt.id); // מעביר את ה-id ולא את האירוע
            }}
          >
            {opt.title}
            {opt.child && <OptionsMenu options={opt.child} />}
            {opt.icon && <opt.icon style={{ marginLeft: 'auto' }} />} {/* הצגת אייקון אם קיים */}
          </MenuItem>
        ))}
        </Menu>
    </>
  );
};

export default OptionsMenu;
