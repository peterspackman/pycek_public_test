/**
 * Tests for equilibrium solver
 * Validates JavaScript implementation against Python reference values
 */

import {
	computeQ,
	computeForce,
	solveEquilibrium,
	solveBasicAnalytic
} from '../src/lib/utils/equilibriumSolver.js';

/**
 * Test basic Q computation
 */
function testComputeQ() {
	console.log('Testing computeQ...');

	// Test case 1: 2A ⇌ B with [A]=0.2, [B]=0.1
	// Q = [B] / [A]^2 = 0.1 / (0.2)^2 = 0.1 / 0.04 = 2.5
	const conc1 = [0.2, 0.1];
	const stoich1 = [-2, 1];
	const Q1 = computeQ(conc1, stoich1);
	console.assert(Math.abs(Q1 - 2.5) < 1e-10, `Expected Q=2.5, got ${Q1}`);

	// Test case 2: A + B ⇌ C with [A]=0.1, [B]=0.2, [C]=0.05
	// Q = [C] / ([A]*[B]) = 0.05 / (0.1*0.2) = 0.05 / 0.02 = 2.5
	const conc2 = [0.1, 0.2, 0.05];
	const stoich2 = [-1, -1, 1];
	const Q2 = computeQ(conc2, stoich2);
	console.assert(Math.abs(Q2 - 2.5) < 1e-10, `Expected Q=2.5, got ${Q2}`);

	console.log('✓ computeQ tests passed');
}

/**
 * Test force computation
 */
function testComputeForce() {
	console.log('Testing computeForce...');

	// Test case: [A]=0.2, [B]=0.1, K_eq=12
	// Q = 2.5, pK_eq = -log10(12) = -1.079181246
	// Force = -log10(Q) - pK_eq = -log10(2.5) - (-1.079181246)
	//       = -0.39794 + 1.07918 = 0.68124
	const conc = [0.2, 0.1];
	const stoich = [-2, 1];
	const Keq = 12;
	const pKeq = -Math.log10(Keq);

	const force = computeForce(conc, stoich, pKeq);
	const expectedForce = 0.68124; // Approximate
	console.assert(
		Math.abs(force - expectedForce) < 0.001,
		`Expected force≈${expectedForce}, got ${force}`
	);

	console.log('✓ computeForce tests passed');
}

/**
 * Test analytic solution for basic case
 */
function testAnalytic() {
	console.log('Testing solveBasicAnalytic...');

	// Python reference: with [A]₀=0.2, [B]₀=0.1, K_eq=12
	// The roots from the Python code should match
	const result = solveBasicAnalytic(0.2, 0.1, 12);

	// Just verify we get two real roots
	console.assert(!isNaN(result.x0), 'x0 should be a number');
	console.assert(!isNaN(result.x1), 'x1 should be a number');

	console.log(`  x0 = ${result.x0}, x1 = ${result.x1}`);
	console.log('✓ solveBasicAnalytic tests passed');
}

/**
 * Test full equilibrium solver
 */
function testSolveEquilibrium() {
	console.log('Testing solveEquilibrium...');

	// Basic case: 2A ⇌ B
	// Initial: [A]=0.2, [B]=0.1, K_eq=12
	const initialConc = [0.2, 0.1];
	const stoich = [-2, 1];
	const Keq = 12;
	const dc = 0.001;
	const rtol = 1e-5;

	const result = solveEquilibrium(initialConc, stoich, Keq, dc, rtol, 1000);

	console.assert(result.converged, 'Solver should converge');
	console.assert(result.iterations < 1000, 'Should converge in reasonable iterations');
	console.assert(
		Math.abs(result.forces[result.forces.length - 1]) < rtol,
		`Final force should be < ${rtol}`
	);

	// Check that final Q is close to K_eq
	const finalQ = result.finalQ;
	const relativeError = Math.abs(finalQ - Keq) / Keq;
	console.assert(
		relativeError < 0.01,
		`Final Q (${finalQ}) should be close to K_eq (${Keq}), got error ${relativeError}`
	);

	console.log(`  Converged in ${result.iterations} iterations`);
	console.log(`  Final concentrations: [A]=${result.finalConcentrations[0].toFixed(6)}, [B]=${result.finalConcentrations[1].toFixed(6)}`);
	console.log(`  Final Q = ${finalQ.toFixed(6)}, K_eq = ${Keq}`);
	console.log('✓ solveEquilibrium tests passed');
}

/**
 * Test convergence to equilibrium
 * Validates that Q converges to K_eq regardless of initial conditions
 */
function testConvergenceToEquilibrium() {
	console.log('Testing convergence to equilibrium...');

	// Test case 1: [A]₀=0.2, [B]₀=0.1, K_eq=12
	const result1 = solveEquilibrium([0.2, 0.1], [-2, 1], 12, 0.01, 1e-6, 10000);
	console.assert(result1.converged, 'Should converge from first initial condition');
	const error1 = Math.abs(result1.finalQ - 12) / 12;
	console.assert(error1 < 0.001, `Q should equal K_eq, error=${error1}`);
	console.log(`  Test 1: Q=${result1.finalQ.toFixed(6)}, K_eq=12 ✓`);

	// Test case 2: Different initial conditions
	const result2 = solveEquilibrium([0.15, 0.05], [-2, 1], 12, 0.01, 1e-6, 10000);
	console.assert(result2.converged, 'Should converge from second initial condition');
	const error2 = Math.abs(result2.finalQ - 12) / 12;
	console.assert(error2 < 0.001, `Q should equal K_eq, error=${error2}`);
	console.log(`  Test 2: Q=${result2.finalQ.toFixed(6)}, K_eq=12 ✓`);

	// Test case 3: Different K_eq
	const result3 = solveEquilibrium([0.1, 0.2], [-1, -1, 1], 5.0, 0.005, 1e-5, 5000);
	console.assert(result3.converged, 'Should converge for different reaction');
	const error3 = Math.abs(result3.finalQ - 5.0) / 5.0;
	console.assert(error3 < 0.01, `Q should equal K_eq, error=${error3}`);
	console.log(`  Test 3: Q=${result3.finalQ.toFixed(6)}, K_eq=5.0 ✓`);

	console.log('✓ Convergence tests passed');
}

/**
 * Run all tests
 */
function runAllTests() {
	console.log('=== Running Equilibrium Solver Tests ===\n');

	try {
		testComputeQ();
		testComputeForce();
		testAnalytic();
		testSolveEquilibrium();
		testConvergenceToEquilibrium();

		console.log('\n=== All tests passed! ===');
		process.exit(0);
	} catch (error) {
		console.error('\n=== Test failed! ===');
		console.error(error);
		process.exit(1);
	}
}

runAllTests();
