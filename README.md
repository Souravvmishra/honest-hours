# HonestHours

A privacy-focused, open-source hourly time tracking application built with Next.js. Track your daily activities hour by hour with customizable prompts and local-only data storage.

🌐 **Live Site**: [https://honest-hours.vercel.app/](https://honest-hours.vercel.app/)

## Features

- ⏰ **Hourly Prompts**: Get reminded to log your activities at customizable intervals
- 📊 **Daily Log View**: Visual overview of your day with missing hours tracking
- 🎨 **Theme Support**: Light, dark, and system theme modes
- 💾 **Local Storage**: All data stored locally using IndexedDB - your privacy is protected
- 📤 **Export Options**: Export your logs in CSV or JSON format (today or weekly)
- ⚙️ **Customizable Settings**: Adjust prompt intervals, day start hour, and more
- 📱 **PWA Ready**: Progressive Web App support for mobile and desktop
- 🔔 **Notifications**: Optional browser notifications for hourly prompts

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Souravvmishra/honest-hours.git
cd honest-hours
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) with [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Tabler Icons](https://tabler.io/icons)
- **Storage**: IndexedDB (browser-native)
- **Language**: TypeScript

## Project Structure

```
honesthours/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── daily-log/        # Daily log components
│   ├── export/           # Export functionality
│   ├── hourly-prompt/     # Hourly prompt modal
│   ├── notifications/    # Notification components
│   ├── settings/         # Settings components
│   └── ui/               # Shadcn UI components
├── lib/                  # Core libraries
│   ├── hooks/           # Custom React hooks
│   ├── storage/         # IndexedDB storage utilities
│   └── utils/           # Utility functions
└── public/              # Static assets
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## Code of Conduct

This project adheres to a Code of Conduct. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before participating.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Privacy

HonestHours is designed with privacy in mind:
- All data is stored locally in your browser
- No data is sent to external servers
- No tracking or analytics
- Fully open source - you can audit the code yourself

## Support

If you encounter any issues or have questions:
- Visit the [live site](https://honest-hours.vercel.app/)
- Open an issue on [GitHub](https://github.com/Souravvmishra/honest-hours/issues)
- Check existing issues and discussions

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Icons from [Tabler Icons](https://tabler.io/icons)
