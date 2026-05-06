# Prisma Valet - Car Valeting Company Website

A modern, responsive website for Prisma Valet premium mobile car valeting services. Built with React, featuring smooth animations, clear value messaging, and a professional design that highlights **fleet & partnership programs**, **ease of use**, **flexibility**, and **premium services with documentation**.

## Features

- **Fleet & Partnership**: Dedicated section and messaging for fleet management, multi-branch operations, and partner programs—with fleet maintenance insights and clear documentation
- **Ease of Use**: Emphasis on simple app booking, real-time tracking, and transparent pricing so customers and fleets spend less time organising
- **Flexibility**: At-home or at-shop service, flexible scheduling, and multiple packages to suit individuals and fleets
- **Premium Services & Documentation**: Premium detailing packages (Quick Sparkle through Ultimate Prestige) with clear service definitions; documentation and support for fleet and partner programs
- **Modern Design**: Clean, professional layout with light color scheme and value-strip highlights
- **Responsive**: Optimized for desktop, tablet, and mobile devices
- **Animations**: Smooth scroll animations using Framer Motion
- **Detail Packages**: Visual showcase of service tiers with interior/exterior options
- **App Download**: Download buttons for iOS and Android apps
- **Docker Ready**: Containerized deployment with Docker and Docker Compose

## Technology Stack

- React 19.1.1
- Framer Motion (animations)
- Styled Components (CSS-in-JS)
- React Icons
- Docker & Docker Compose

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### Production with Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

The website will be available at [http://localhost:3000](http://localhost:3000).

### Docker Network

The application uses the `prisma_shared_net` network as specified, allowing it to communicate with other services in the Prisma ecosystem.

## Project Structure

```
prismahome/
├── public/                 # Static assets
├── src/
│   ├── App.js             # Main application component
│   ├── App.css            # Application styles
│   ├── index.js           # Application entry point
│   └── index.css          # Global styles
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
└── package.json           # Dependencies and scripts
```

## Sections

1. **Hero Section**: Company introduction with value strip (Fleet & Partnership, Ease of Use, Flexibility, Premium & Docs)
2. **Built for Scale & Simplicity**: How Prisma Valet delivers ease of use, flexibility, fleet/partnership support, and technology integration
3. **Fleet & Partnership**: Fleet management, partnership programs, and flexibility—one platform for fleets, branches, and partners
4. **Detail Packages**: Service tiers from Quick Sparkle to Ultimate Prestige with images and pricing
5. **Reviews**: Trust and ratings
6. **Ease of Use / Mobile**: Simple booking, maximum flexibility, at-home or at-shop
7. **Transform / Licensed**: Premium service and scaling for individuals, fleets, and partners
8. **Gift / Download**: Gifting and app download
9. **Premium Services & Documentation**: Clear packages, documentation, and support for partnerships
10. **FAQ & Footer**: FAQs, Privacy Policy, Cookie Demo, Documentation & Partnerships link

## Customization

The website uses a light color scheme with:

- Primary: #3498db (blue)
- Secondary: #2c3e50 (dark blue-gray)
- Accent: #e74c3c (red for problems)
- Background: #f8f9fa (light gray)

Colors can be easily modified in the styled components within `App.js`.

## Deployment

The application is optimized for static hosting and can be deployed to:

- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static hosting service

For containerized deployment, use the provided Docker configuration.

## Future Enhancements

- Functional app download links
- Dedicated documentation/partnership landing page
- Contact form integration
- Customer testimonials section
- Online booking system integration
