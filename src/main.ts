import {error, success, TypeChatLanguageModel} from "typechat";
import axios from "axios";

const axiosConfig = { validateStatus: status => true };

interface QuivrLanguageModelConfig {
    endpoint?: string;
    model?: string;
    max_tokens?: number;
}

const defaultQuivrModelConfig = {
    endpoint: "https://api.quivr.app",
    model: "gpt-3.5-turbo-0613",
    max_tokens: 256
};

/**
 * Creates a language model encapsulation of a Quivr REST API from environnement variables.
 * @param env Envirement variables
 * @param additionalConfig The additionnal configuration for the QuivrLanguageModel :
 *          endpoint: API endpoint for Quivr. Defaults to https://api.quivr.app
 *          model: Model to use in the Quivr instance. Defaults to gpt-3.5-turbo-0613
 *          max_tokens: Maximum tokens. Defaults to 250
 */
export function createQuivrLanguageModel(env: Record<string, string | undefined>, additionalConfig?: QuivrLanguageModelConfig): TypeChatLanguageModel {
    if (env.QUIVR_API_KEY) {
        if (env.QUIVR_BRAIN_ID) {
            return createQuivrLanguageModelExplicit(env.QUIVR_API_KEY, env.QUIVR_BRAIN, {
                ...defaultQuivrModelConfig,
                ...(additionalConfig ?? {})
            })
        } else
            throw new Error(`"Missing environment variable: QUIVR_BRAIN`);
    } else
        throw new Error(`"Missing environment variable: QUIVR_API_KEY`);
}


/**
 * Creates a language model encapsulation of a Quivr REST API endpoint with parameters.
 * @param apiKey The Quivr API key.
 * @param brain_id The brain to use for this model
 * @param options The additionnal configuration for the QuivrLanguageModel :
 *          endpoint: API endpoint for Quivr. Defaults to https://api.quivr.app
 *          model: Model to use in the Quivr instance. Defaults to gpt-3.5-turbo-0613
 *          max_tokens: Maximum tokens. Defaults to 250
 */
export const createQuivrLanguageModelExplicit = (
    apiKey: string,
    brain_id: string,
    options?: QuivrLanguageModelConfig,
    ): TypeChatLanguageModel => {

    const {endpoint, model, max_tokens} = options;

    const client = axios.create({
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "user-agent": "quivr-typechat",
        }
    })

    return {
        complete
    };

    async function complete(question: string) {
        console.log(`Calling Quivr instance ${endpoint} using brain_id ${brain_id}`, options);
        const chatParams = {
            model,
            max_tokens,
            temperature: 0,
            question
        }

        const newChatName = `Typechat ${Date.now()} - ${Math.round(Math.random() * 10)}`

        const result = await client.post(`${endpoint}/chat`, {
            name: newChatName
        }, axiosConfig);
        if (result.status === 200) {
            const chat_id = result.data.chat_id;
            console.log("Created new chat on Quivr ", result.data.chat_id)
            const resultChatQuestion = await client.post(`${endpoint}/chat/${chat_id}/question?brain_id=${brain_id}`, chatParams, axiosConfig);
            if (resultChatQuestion.status === 200) {
                console.log("Result: ", resultChatQuestion.data.assistant);
                return success(resultChatQuestion.data.assistant);
            }
            else
                return error(`Quivr API Error on question ${resultChatQuestion.status}: ${resultChatQuestion.statusText}`);
        }
        return error(`Quivr API Error on creating chat ${result.status}: ${result.statusText}`);
    }
}
