/**
 * Equilibrium Solver for Chemical Reactions
 *
 * Implements iterative numerical methods to solve chemical equilibrium equations.
 * Based on the Python implementation from equilibrium.py and equilibrium_basic.py
 */

/**
 * Compute the reaction quotient Q
 * Q = ∏ [C]^ν where ν is the stoichiometric coefficient
 *
 * @param {number[]} conc - Array of concentrations
 * @param {number[]} stoich - Array of stoichiometric coefficients
 * @returns {number|null} - Reaction quotient or null if invalid
 */
export function computeQ(conc, stoich) {
	let Q = 1;
	for (let i = 0; i < conc.length; i++) {
		// If reactant (negative stoich) has zero concentration, invalid
		if (conc[i] === 0 && stoich[i] < 0) {
			return null;
		}
		Q *= Math.pow(conc[i], stoich[i]);
	}
	return Q;
}

/**
 * Compute the "force" - a measure of how far from equilibrium the system is
 * Force = -log10(Q) - pK_eq
 * When force = 0, the system is at equilibrium
 *
 * @param {number[]} conc - Array of concentrations
 * @param {number[]} stoich - Array of stoichiometric coefficients
 * @param {number} pKeq - Negative log10 of equilibrium constant
 * @returns {number} - Force value
 */
export function computeForce(conc, stoich, pKeq) {
	const Q = computeQ(conc, stoich);

	if (Q === null) {
		// Concentration of at least one reactant is zero
		return -1;
	} else if (Q === 0) {
		// Concentration of at least one product is zero
		return 1;
	} else {
		return -Math.log10(Q) - pKeq;
	}
}

/**
 * Update concentrations based on the force
 * New concentration = old concentration + δc × stoichiometry × force
 *
 * @param {number[]} conc - Current concentrations
 * @param {number[]} stoich - Stoichiometric coefficients
 * @param {number} force - Current force value
 * @param {number} dc - Step size
 * @param {boolean} ensurePositive - If true, reduce dc to keep concentrations positive
 * @returns {{conc: number[], dc: number}} - Updated concentrations and step size
 */
export function updateConcentrations(conc, stoich, force, dc, ensurePositive = false) {
	if (ensurePositive) {
		// Try up to 5 times to find a dc that keeps all concentrations positive
		for (let i = 0; i < 5; i++) {
			const newConc = conc.map((c, idx) => c + dc * stoich[idx] * force);
			if (newConc.every((c) => c > 0)) {
				return { conc: newConc, dc };
			}
			dc /= 2;
		}
	}

	const newConc = conc.map((c, idx) => c + dc * stoich[idx] * force);
	return { conc: newConc, dc };
}

/**
 * Solve chemical equilibrium using iterative force-based method
 *
 * @param {number[]} initialConc - Initial concentrations for each species
 * @param {number[]} stoichiometry - Stoichiometric coefficients (negative for reactants, positive for products)
 * @param {number} Keq - Equilibrium constant
 * @param {number} dc - Initial step size for concentration updates
 * @param {number} rtol - Convergence tolerance (stops when |force| < rtol)
 * @param {number} maxIterations - Maximum number of iterations
 * @param {Object} options - Additional options
 * @param {boolean} options.decreaseDc - Decrease dc when force changes sign
 * @param {boolean} options.increaseDc - Increase dc when force keeps same sign
 * @param {boolean} options.ensurePositive - Ensure all concentrations remain positive
 * @returns {Object} - Results containing concentration history, forces, and convergence info
 */
export function solveEquilibrium(
	initialConc,
	stoichiometry,
	Keq,
	dc,
	rtol = 1e-5,
	maxIterations = 1000,
	options = {}
) {
	const { decreaseDc = false, increaseDc = false, ensurePositive = false } = options;

	const pKeq = -Math.log10(Keq);
	const nSpecies = initialConc.length;

	// Store results
	const concentrations = []; // Array of concentration arrays
	const forces = [];
	const deltas = [];

	// Initialize
	let conc = [...initialConc];
	let currentDc = dc;
	let force = computeForce(conc, stoichiometry, pKeq);

	concentrations.push([...conc]);
	forces.push(force);
	deltas.push(currentDc);

	// Iterate
	for (let i = 0; i < maxIterations; i++) {
		// Update concentrations
		const result = updateConcentrations(conc, stoichiometry, force, currentDc, ensurePositive);
		conc = result.conc;
		currentDc = result.dc;

		const prevForce = force;
		force = computeForce(conc, stoichiometry, pKeq);

		// Adjust step size based on force behavior
		if (decreaseDc && force * prevForce < 0) {
			// Force changed sign - we overshot, decrease step
			currentDc /= 2;
		}

		if (increaseDc && force * prevForce > 0) {
			// Force same sign - accelerate
			currentDc *= 1.5;
		}

		// Store results
		concentrations.push([...conc]);
		forces.push(force);
		deltas.push(currentDc);

		// Check convergence
		if (Math.abs(force) < rtol) {
			return {
				concentrations,
				forces,
				deltas,
				converged: true,
				iterations: i + 1,
				finalQ: computeQ(conc, stoichiometry),
				finalConcentrations: conc
			};
		}
	}

	// Did not converge
	return {
		concentrations,
		forces,
		deltas,
		converged: false,
		iterations: maxIterations,
		finalQ: computeQ(conc, stoichiometry),
		finalConcentrations: conc
	};
}

/**
 * Solve the basic equilibrium problem: 2A ⇌ B
 * This has an analytic solution for comparison:
 * (b+x) / (a-2x)^2 = K_eq
 *
 * @param {number} concA - Initial concentration of A
 * @param {number} concB - Initial concentration of B
 * @param {number} Keq - Equilibrium constant
 * @returns {Object} - Analytic solution roots
 */
export function solveBasicAnalytic(concA, concB, Keq) {
	const a = concA;
	const b = concB;
	const c = Keq;

	const discriminant = 8 * a * c + 16 * b * c + 1;
	const sqrtDisc = Math.sqrt(discriminant);

	const x0 = (-sqrtDisc + 4 * a * c + 1) / (8 * c);
	const x1 = (sqrtDisc + 4 * a * c + 1) / (8 * c);

	return { x0, x1 };
}

/**
 * Format chemical equation as LaTeX
 *
 * @param {string[]} species - Array of species names
 * @param {number[]} stoich - Array of stoichiometric coefficients
 * @returns {string} - LaTeX string for the equation
 */
export function formatEquationLatex(species, stoich) {
	const formatSpecies = (s) => {
		// Format charges: H+ -> H^{+}, SO4^2- -> SO4^{2-}
		return s
			.replace(/(\d+)\+/g, '^{$1+}')
			.replace(/\+$/g, '^{+}')
			.replace(/(\d+)-/g, '^{$1-}')
			.replace(/-$/g, '^{-}');
	};

	let reactants = [];
	let products = [];

	for (let i = 0; i < species.length; i++) {
		const formatted = formatSpecies(species[i]);
		const coef = Math.abs(stoich[i]);
		const term = coef > 1 ? `${coef}\\mathrm{${formatted}}` : `\\mathrm{${formatted}}`;

		if (stoich[i] < 0) {
			reactants.push(term);
		} else if (stoich[i] > 0) {
			products.push(term);
		}
	}

	return `${reactants.join(' + ')} \\rightleftharpoons ${products.join(' + ')}`;
}
