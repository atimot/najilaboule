tailwind.config = {
    theme: {
        extend: {
            colors: {
                base: '#241816', // 指定のベースカラー
                accent: '#C8A67B', // ゴールド系のアクセント
                'dot-white': '#FFFFFF',
                'dot-black': '#000000',
                'dot-red': '#E60012',
                'dot-blue': '#0099CC',
                'dot-yellow': '#FFD700',
                'dot-green': '#009944',
                'dot-orange': '#F39800',
                'dot-pink': '#E6007F',
                'dot-purple': '#920783',
            },
            fontFamily: {
                serif: ['"Playfair Display"', '"Shippori Mincho"', 'serif'],
                sans: ['"Helvetica Neue"', 'Arial', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        }
    }
}

