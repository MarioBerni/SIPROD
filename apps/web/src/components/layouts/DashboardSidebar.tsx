'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Divider,
  Collapse,
} from '@mui/material';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { navigationConfig } from '@/config/navigation';

interface DashboardSidebarProps {
  onClose: () => void;
  open: boolean;
  variant: 'permanent' | 'persistent' | 'temporary';
}

const DrawerHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText
}));

const HeaderContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  height: 80 // Altura fija para el contenedor
});

const LogoContainer = styled(Box)({
  height: '100%',
  display: 'flex',
  alignItems: 'center'
});

const GRLogo = styled('img')({
  height: '100%',
  width: 'auto'
});

const UserInfo = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
});

const DrawerFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  position: 'fixed',
  bottom: 0,
  width: 280,
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2)
}));

const LogoImage = styled('img')({
  width: 40,
  height: 'auto'
});

const FooterText = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
});

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 280,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 280,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.default,
    borderRight: `1px solid ${theme.palette.divider}`,
    zIndex: 1300 // Mayor que el z-index del AppBar
  },
}));

export function DashboardSidebar({
  onClose,
  open,
  variant,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});

  // Efecto para abrir automáticamente el submenú de la ruta actual
  useEffect(() => {
    if (pathname) {
      const currentNavItem = navigationConfig.find(item => 
        item.subItems?.some(subItem => subItem.href === pathname)
      );
      
      if (currentNavItem) {
        setOpenSubMenus(prev => ({
          ...prev,
          [currentNavItem.title]: true
        }));
      }
    }
  }, [pathname]);

  // Manejador para la navegación
  const handleNavigation = () => {
    if (variant === 'temporary') {
      onClose?.();
    }
  };

  const handleSubMenu = (title: string, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenSubMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const renderNavItem = (item: typeof navigationConfig[0]) => {
    const active = pathname === item.href;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isSubMenuOpen = openSubMenus[item.title];
    const Icon = item.icon;

    return (
      <Box key={item.title}>
        <ListItem
          disablePadding
          sx={{ mb: 0.5 }}
        >
          <ListItemButton
            onClick={hasSubItems ? (e: React.MouseEvent<HTMLDivElement>) => handleSubMenu(item.title, e) : handleNavigation}
            component={hasSubItems ? 'div' : 'a'}
            href={hasSubItems ? undefined : item.href}
            sx={{
              borderRadius: 1,
              color: active ? 'primary.main' : 'text.secondary',
              backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              '&:hover': {
                backgroundColor: active 
                  ? alpha(theme.palette.primary.main, 0.15)
                  : alpha(theme.palette.primary.main, 0.05),
              }
            }}
          >
            <ListItemIcon
              sx={{
                color: active ? 'primary.main' : 'text.secondary',
                minWidth: 40,
              }}
            >
              <Icon />
            </ListItemIcon>
            <ListItemText 
              primary={item.title}
              primaryTypographyProps={{
                variant: 'body2',
                fontWeight: active ? 'bold' : 'normal',
              }}
            />
            {hasSubItems && (
              isSubMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />
            )}
          </ListItemButton>
        </ListItem>
        {hasSubItems && item.subItems && (
          <Collapse in={isSubMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.subItems.map((subItem) => {
                const subActive = pathname === subItem.href;
                const SubIcon = subItem.icon;
                return (
                  <ListItem
                    key={subItem.title}
                    disablePadding
                    sx={{ pl: 4 }}
                  >
                    <ListItemButton
                      onClick={handleNavigation}
                      component="a"
                      href={subItem.href}
                      sx={{
                        borderRadius: 1,
                        color: subActive ? 'primary.main' : 'text.secondary',
                        backgroundColor: subActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                        '&:hover': {
                          backgroundColor: subActive 
                            ? alpha(theme.palette.primary.main, 0.15)
                            : alpha(theme.palette.primary.main, 0.05),
                        }
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: subActive ? 'primary.main' : 'text.secondary',
                          minWidth: 40,
                        }}
                      >
                        <SubIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={subItem.title}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: subActive ? 'bold' : 'normal',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const content = (
    <>
      <DrawerHeader>
        <HeaderContent>
          <LogoContainer>
            <GRLogo
              src="/images/logo-gr-dorado.svg"
              alt="GR Logo"
            />
          </LogoContainer>
          <UserInfo>
            <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
              Bienvenido
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Comisario
            </Typography>
            <Typography variant="body2">
              Juan Pérez González
            </Typography>
          </UserInfo>
        </HeaderContent>
      </DrawerHeader>
      <Divider />
      <Box sx={{ p: 2, pb: 8 }}>
        <List>
          {navigationConfig.map(renderNavItem)}
        </List>
      </Box>

      <DrawerFooter>
        <LogoImage
          src="/images/logo-siprod.svg"
          alt="SIPROD Logo"
        />
        <FooterText>
          <Typography variant="caption" color="textSecondary">
            SIPROD v1.0.0
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Estado Mayor Policial, 2025
          </Typography>
        </FooterText>
      </DrawerFooter>
    </>
  );

  return (
    <StyledDrawer
      anchor="left"
      onClose={onClose}
      open={open}
      variant={variant}
      PaperProps={{
        sx: {
          width: 280
        }
      }}
    >
      {content}
    </StyledDrawer>
  );
}
