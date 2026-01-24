// Test file with direct import
import { authProvider } from './lib/auth-provider';
import { entryRepository } from './lib/entry-repository';

console.log('Direct imports work!', authProvider, entryRepository);
