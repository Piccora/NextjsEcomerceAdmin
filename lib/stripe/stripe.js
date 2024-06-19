import {loadStripe} from '@stripe/stripe-js';

export const stripe = await loadStripe(process.env.STRIPE_SECRET);