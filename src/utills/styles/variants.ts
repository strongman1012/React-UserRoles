import { blue, green, grey } from '@material-ui/core/colors';

const lightVariant = {
	name: 'Light',
	palette: {
		primary: {
			main: blue[800],
			contrastText: '#FFF'
		},
		secondary: {
			main: blue[600],
			contrastText: '#FFF'
		}
	},
	header: {
		color: grey[500],
		background: '#FFF',
		search: {
			color: grey[800]
		},
		indicator: {
			background: blue[600]
		}
	},
	sidebar: {
		color: '#FFF',
		background: blue[700],
		header: {
			color: '#FFF',
			background: blue[800],
			brand: {
				color: '#FFFFFF'
			}
		},
		footer: {
			color: '#FFF',
			background: blue[800],
			online: {
				background: '#FFF'
			}
		},
		category: {
			fontWeight: 400
		},
		badge: {
			color: '#000',
			background: '#FFF'
		}
	},
	body: {
		background: '#F7F9FC'
	}
};

const darkVariant = {
	name: 'Dark',
	palette: {
		primary: {
			main: '#232323',
			contrastText: '#000'
		},
		secondary: {
			main: '#2d2d2d',
			contrastText: '#FFF'
		}
	},
	header: {
		color: grey[500],
		background: '#FFFFFF',
		search: {
			color: grey[800]
		},
		indicator: {
			background: blue[600]
		}
	},
	sidebar: {
		color: grey[200],
		background: '#1B2430',
		header: {
			color: grey[200],
			background: '#232f3e',
			brand: {
				color: blue[500]
			}
		},
		footer: {
			color: grey[200],
			background: '#232f3e',
			online: {
				background: green[500]
			}
		},
		category: {
			fontWeight: 400
		},
		badge: {
			color: '#FFF',
			background: blue[500]
		}
	},
	body: {
		background: '#F7F9FC'
	}
};

const variants: Array<ThemeOptions> = [darkVariant, lightVariant];

export default variants;

export type ThemeOptions = {
	name: string;
	palette: {
		primary: MainContrastTextType;
		secondary: MainContrastTextType;
	};
	header: ColorBgType & {
		search: {
			color: string;
		};
		indicator: {
			background: string;
		};
	};
	sidebar: ColorBgType & {
		header: ColorBgType & {
			brand: {
				color: string;
			};
		};
		footer: ColorBgType & {
			online: {
				background: string;
			};
		};
		category: {
			fontWeight: number;
		};
		badge: ColorBgType;
	};
	body: {
		background: string;
	};
};

type MainContrastTextType = {
	main: string;
	contrastText: string;
};
type ColorBgType = {
	color: string;
	background: string;
};
