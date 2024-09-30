/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

import './blocks.scss';

// Import Native blocks here.
import StaticNativeBlock from './StaticNativeBlock/block';

[StaticNativeBlock].forEach(block => registerBlockType(block.name, block));
